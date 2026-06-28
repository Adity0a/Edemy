import Course from "../models/Course.js";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";

// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const educator = req.auth.userId;

        if (!educator) {
            return res.json({ success: false, message: 'Educator ID missing' });
        }

        const parsedCourseData = JSON.parse(courseData);

        const newCourse = new Course({
            ...parsedCourseData,
            educator
        });

        await newCourse.save();

        res.json({ success: true, message: 'Course Added Successfully' });
    } catch (error) {
        console.error("Add Course Error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // Find courses for this educator
        const courses = await Course.find({ educator });

        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Educator Dashboard Stats
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({ educator });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from completed purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Get enrolled students data from purchases
        const enrolledStudentsData = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('courseId', 'courseTitle').populate('userId', 'name imageUrl');

        const formattedData = enrolledStudentsData.map(purchase => ({
            courseTitle: purchase.courseId ? purchase.courseId.courseTitle : 'Deleted Course',
            student: {
                name: purchase.userId ? purchase.userId.name : 'Unknown Student',
                imageUrl: purchase.userId ? purchase.userId.imageUrl : ''
            },
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData: formattedData,
                totalCourses
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Enrolled Students for Educator
export const getEnrolledStudents = async (req, res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({ educator });

        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('courseId').populate('userId');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId || { name: 'Unknown Student', imageUrl: '' },
            courseTitle: purchase.courseId ? purchase.courseId.courseTitle : 'Deleted Course',
            purchaseDate: purchase.createdAt
        }));

        res.json({ success: true, enrolledStudents });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseData } = req.body;
        const educator = req.auth.userId;

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: id, educator },
            { ...JSON.parse(courseData) },
            { new: true }
        );

        if (!updatedCourse) {
            return res.json({ success: false, message: 'Course not found or unauthorized' });
        }

        res.json({ success: true, message: 'Course Updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const educator = req.auth.userId;

        const deletedCourse = await Course.findOneAndDelete({ _id: id, educator });

        if (!deletedCourse) {
            return res.json({ success: false, message: 'Course not found or unauthorized' });
        }

        res.json({ success: true, message: 'Course Deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Debug Educator IDs (Temporary)
export const debugEducatorIds = async (req, res) => {
    try {
        const ids = await Course.distinct('educator');
        res.json({ success: true, educatorIdsInDb: ids });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
