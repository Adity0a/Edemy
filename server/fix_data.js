import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/db.js';
import Course from './models/Course.js';
import User from './models/User.js';
import Purchase from './models/Purchase.js';

// The ID from your console log
const CORRECT_ID = "user_3Figo8vwForNiHU1CX2VSambGjG";

const fixData = async () => {
    try {
        await connectDB();

        console.log(`\n--- DATABASE DIAGNOSTIC ---`);
        console.log(`Connected to: ${mongoose.connection.name}`);

        // 1. Check if the "College" user exists
        let user = await User.findById(CORRECT_ID.trim());
        if (!user) {
            user = await User.create({
                _id: CORRECT_ID.trim(),
                name: "College",
                email: "college@example.com",
                enrolledCourses: []
            });
            console.log(`✅ Created missing User record for: ${CORRECT_ID}`);
        } else {
            console.log(`✅ User record already exists.`);
        }

        // 2. Sync Educator ID for ALL courses in this specific DB
        const allCourses = await Course.find({});
        console.log(`Found ${allCourses.length} courses in collection '${Course.collection.name}'`);

        if (allCourses.length > 0) {
            const result = await Course.updateMany({}, { educator: CORRECT_ID.trim() });
            console.log(`✅ Updated ${result.modifiedCount} courses to belong to educator: ${CORRECT_ID}`);
        } else {
            console.log(`⚠️ WARNING: No courses were found to update!`);
        }

        // 3. Link purchases to valid courses (if any)
        const allPurchases = await Purchase.find({});
        if (allPurchases.length > 0 && allCourses.length > 0) {
            console.log(`Found ${allPurchases.length} purchases. Linking to available courses...`);
            // This is a simple fix: assign all purchases to the first course found if they are orphaned
            for (let purchase of allPurchases) {
                const courseExists = await Course.findById(purchase.courseId);
                if (!courseExists) {
                    purchase.courseId = allCourses[0]._id;
                    await purchase.save();
                }
            }
            console.log(`✅ Purchase records verified/re-linked.`);
        }

        console.log(`\n--- FIX COMPLETED ---`);
        console.log(`Please RESTART your server and refresh the browser.`);
        process.exit();
    } catch (err) {
        console.error("❌ ERROR DURING FIX:", err);
        process.exit(1);
    }
};

fixData();
