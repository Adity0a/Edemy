import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import CourseProgress from "../models/CourseProgress.js";

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
