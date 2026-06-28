import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/db.js';
import Course from './models/Course.js';

// This is your ACTUAL Clerk ID from the browser console logs in your screenshots
const YOUR_ACTUAL_CLERK_ID = "user_3Figo8vwForNiHU1CX2VSambGjG";

const fixEducatorId = async () => {
    try {
        await connectDB();

        console.log("Checking courses in database...");

        // Find all unique educator IDs currently in the DB
        const distinctIds = await Course.distinct('educator');
        console.log("Found educator IDs in DB:", distinctIds);

        if (distinctIds.length === 0) {
            console.log("No courses found in database. Please run node seedCourses.js first.");
            process.exit(0);
        }

        // Update ALL courses to belong to your actual Clerk ID
        const result = await Course.updateMany({}, { educator: YOUR_ACTUAL_CLERK_ID });

        console.log(`Successfully updated ${result.modifiedCount} courses.`);
        console.log(`All courses now belong to: ${YOUR_ACTUAL_CLERK_ID}`);

        console.log("\n--- SUCCESS ---");
        console.log("Please refresh your Educator Dashboard in the browser.");

        process.exit(0);
    } catch (error) {
        console.error("Error fixing educator IDs:", error.message);
        process.exit(1);
    }
};

fixEducatorId();
