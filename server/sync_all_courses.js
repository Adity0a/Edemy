import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/db.js';
import Course from './models/Course.js';

const syncAllCourses = async () => {
    try {
        await connectDB();

        console.log("Searching for your recently added course...");

        // Find the most recent course - this is the one you added manually that IS working
        const latestCourse = await Course.findOne().sort({ createdAt: -1 });

        if (!latestCourse) {
            console.log("No courses found in database at all.");
            process.exit(0);
        }

        const correctEducatorId = latestCourse.educator;
        console.log(`Found your working Educator ID: "${correctEducatorId}"`);

        // Update ALL courses to use this verified ID
        const result = await Course.updateMany({}, { educator: correctEducatorId });

        console.log(`\n--- SUCCESS ---`);
        console.log(`Updated ${result.modifiedCount} courses to belong to: ${correctEducatorId}`);
        console.log(`Now all courses will appear in your Educator Dashboard.`);

        process.exit(0);
    } catch (error) {
        console.error("Error syncing courses:", error.message);
        process.exit(1);
    }
};

syncAllCourses();
