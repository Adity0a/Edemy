import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    courseContent: [
        {
            chapterId: { type: String, required: true },
            chapterOrder: { type: Number, required: true },
            chapterTitle: { type: String, required: true },
            chapterContent: [
                {
                    lectureId: { type: String, required: true },
                    lectureTitle: { type: String, required: true },
                    lectureDuration: { type: Number, required: true },
                    lectureUrl: { type: String, required: true },
                    isPreviewFree: { type: Boolean, default: false },
                    lectureOrder: { type: Number, required: true }
                }
            ]
        }
    ],
    educator: { type: String, ref: 'User', required: true }, // Reference User model
    enrolledStudents: [{ type: String }], // Array of Clerk User IDs
    courseRatings: [
        {
            userId: { type: String },
            rating: { type: Number, min: 1, max: 5 }
        }
    ]
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;
