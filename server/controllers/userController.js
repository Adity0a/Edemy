import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";

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
            // Create user if not found
            user = await User.create({
                _id: userId,
                name: 'User',
                email: 'user@example.com',
                enrolledCourses: []
            })
            return res.json({ success: true, enrolledCourses: [] });
        }

        res.json({ success: true, enrolledCourses: user.enrolledCourses });
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
        if (!user) {
            user = await User.create({
                _id: userId,
                name: 'User', // In a real app, you'd get this from Clerk
                email: 'user@example.com',
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
