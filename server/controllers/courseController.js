import Course from "../models/Course.js";

// Get All Courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent'])
            .populate('educator');
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Course by Id
export const getCourseId = async (req, res) => {
    const { id } = req.params;
    try {
        const courseData = await Course.findById(id);

        if (!courseData) {
            return res.json({ success: false, message: 'Course not found' });
        }

        res.json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
