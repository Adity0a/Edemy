import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLectures: { type: Array, default: [] }
}, { minimize: false });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default CourseProgress;
