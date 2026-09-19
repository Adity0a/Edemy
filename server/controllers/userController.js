import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import CourseProgress from "../models/CourseProgress.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Get User Data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId; // Assuming userId is attached to req by auth middleware
        const user = await User.findById(userId).populate('enrolledCourses');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// User Enrolled Courses
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        let user = await User.findById(userId).populate('enrolledCourses');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const enrolledCoursesWithProgress = await Promise.all(user.enrolledCourses.map(async (course) => {
            const progress = await CourseProgress.findOne({ userId, courseId: course._id });
            return {
                ...course._doc,
                completedLectures: progress ? progress.completedLectures : []
            };
        }));

        res.json({ success: true, enrolledCourses: enrolledCoursesWithProgress });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Purchase Course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.auth.userId;

        const course = await Course.findById(courseId);
        let user = await User.findById(userId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        // If user doesn't exist in MongoDB, create them (Sync with Clerk data from request if possible, or placeholder)
// Inside purchaseCourse function...
if (!user) {
    user = await User.create({
        _id: userId,
        name: 'Student ' + userId.slice(-4), // Example: "Student a1b2"
        email: 'user@example.com',
        imageUrl: `https://i.pravatar.cc/150?u=${userId}`, // Automatic dummy photo
        enrolledCourses: []
    })
}

        if (user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'Already Enrolled' });
        }

        // Add Course to User's enrolledCourses
        user.enrolledCourses.push(courseId);
        await user.save();

        // Add User to Course's enrolledStudents
        course.enrolledStudents.push(userId);
        await course.save();

        // Create Purchase Record
        await Purchase.create({
            courseId,
            userId,
            amount: course.coursePrice - (course.discount * course.coursePrice) / 100,
            status: 'completed'
        })

        res.json({ success: true, message: 'Enrolled Successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update User Course Progress
export const updateCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, lectureId } = req.body;
        const progress = await CourseProgress.findOne({ userId, courseId });

        if (progress) {
            if (progress.completedLectures.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture already completed' });
            }
            progress.completedLectures.push(lectureId);
            await progress.save();
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                completedLectures: [lectureId]
            })
        }

        res.json({ success: true, message: 'Progress Updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.json({ success: true, progressData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Add Rating to Course
export const addRating = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, rating } = req.body;

        if (!courseId || !rating || rating < 1 || rating > 5) {
            return res.json({ success: false, message: 'Invalid Rating Details' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        const userRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (userRatingIndex > -1) {
            course.courseRatings[userRatingIndex].rating = rating;
        } else {
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        res.json({ success: true, message: 'Rating Added' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.auth.userId;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        const finalPrice = course.coursePrice - (course.discount * course.coursePrice) / 100;
        const amountInPaise = Math.round(finalPrice * 100);

        if (amountInPaise < 100) {
            return res.status(400).json({ success: false, message: 'Minimum amount must be 100 paise' });
        }

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);
        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Razorpay Create Order Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Verify Razorpay Payment Signature
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
        const userId = req.auth.userId;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }

        // Verify Signature
        const text = razorpay_order_id + "|" + razorpay_payment_id;
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        // Fulfillment logic (Same as purchaseCourse)
        const course = await Course.findById(courseId);
        let user = await User.findById(userId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        if (!user) {
            user = await User.create({
                _id: userId,
                name: 'Student ' + userId.slice(-4),
                email: 'user@example.com',
                imageUrl: `https://i.pravatar.cc/150?u=${userId}`,
                enrolledCourses: []
            });
        }

        if (user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'Already Enrolled' });
        }

        user.enrolledCourses.push(courseId);
        await user.save();

        course.enrolledStudents.push(userId);
        await course.save();

        await Purchase.create({
            courseId,
            userId,
            amount: course.coursePrice - (course.discount * course.coursePrice) / 100,
            status: 'completed'
        });

        res.json({ success: true, message: 'Enrolled and Paid Successfully' });
    } catch (error) {
        console.error("Razorpay Verify Payment Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

