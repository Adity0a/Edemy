import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/db.js';
import Course from './models/Course.js';

// EXACT User ID from your screenshot console log: user_3Figo8vwForNiHU1CX2VSambGjG
const REAL_USER_ID = "user_3Figo8vwForNiHU1CX2VSambGjG";

const courses = [
    {
        courseTitle: "Introduction to JavaScript",
        courseDescription: "<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language that powers the web. In this course, you will learn the fundamentals of JavaScript, including syntax, data types, and control structures.</p>",
        coursePrice: 49.99,
        isPublished: true,
        discount: 20,
        courseContent: [
            {
                chapterId: "chapter1",
                chapterOrder: 1,
                chapterTitle: "Getting Started",
                chapterContent: [
                    { lectureId: "l1", lectureTitle: "What is JS?", lectureDuration: 10, lectureUrl: "https://youtu.be/sample1", isPreviewFree: true, lectureOrder: 1 }
                ]
            }
        ],
        educator: REAL_USER_ID,
        enrolledStudents: ["user_student_001", "user_student_002"],
        courseRatings: [{ userId: "user_student_001", rating: 5 }],
        courseThumbnail: "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg"
    },
    {
        courseTitle: "Advanced Python Programming",
        courseDescription: "<h2>Deep Dive into Python</h2><p>Master decorators, generators, and more in this advanced Python course.</p>",
        coursePrice: 79.99,
        isPublished: true,
        discount: 15,
        courseContent: [
            {
                chapterId: "chapter1",
                chapterOrder: 1,
                chapterTitle: "Advanced Concepts",
                chapterContent: [
                    { lectureId: "l2", lectureTitle: "Decorators", lectureDuration: 15, lectureUrl: "https://youtu.be/sample2", isPreviewFree: true, lectureOrder: 1 }
                ]
            }
        ],
        educator: REAL_USER_ID,
        enrolledStudents: ["user_student_003"],
        courseRatings: [{ userId: "user_student_003", rating: 4 }],
        courseThumbnail: "https://img.youtube.com/vi/HdLIMoQkXFA/maxresdefault.jpg"
    },
    {
        courseTitle: "React for Beginners",
        courseDescription: "<h2>Build Modern UI with React</h2><p>Learn components, hooks, and state management.</p>",
        coursePrice: 59.99,
        isPublished: true,
        discount: 10,
        courseContent: [
            {
                chapterId: "chapter1",
                chapterOrder: 1,
                chapterTitle: "React Basics",
                chapterContent: [
                    { lectureId: "l3", lectureTitle: "JSX Basics", lectureDuration: 12, lectureUrl: "https://youtu.be/sample3", isPreviewFree: true, lectureOrder: 1 }
                ]
            }
        ],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/lpx2zFkapIk/maxresdefault.jpg"
    },
    {
        courseTitle: "Full-Stack Web Development",
        courseDescription: "<h2>MERN Stack Bootcamp</h2><p>Learn MongoDB, Express, React, and Node.js.</p>",
        coursePrice: 199.99,
        isPublished: true,
        discount: 25,
        courseContent: [
            {
                chapterId: "chapter1",
                chapterOrder: 1,
                chapterTitle: "MERN Overview",
                chapterContent: [
                    { lectureId: "l4", lectureTitle: "Project Setup", lectureDuration: 20, lectureUrl: "https://youtu.be/sample4", isPreviewFree: true, lectureOrder: 1 }
                ]
            }
        ],
        educator: REAL_USER_ID,
        enrolledStudents: ["user_student_001"],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/jZFaMEqEqEQ/maxresdefault.jpg"
    },
    {
        courseTitle: "UI/UX Design Essentials",
        courseDescription: "<h2>Design Beautiful Apps</h2><p>Learn Figma, color theory, and typography.</p>",
        coursePrice: 39.99,
        isPublished: true,
        discount: 5,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/E4znbZgUWzA/maxresdefault.jpg"
    },
    {
        courseTitle: "Machine Learning with Python",
        courseDescription: "<h2>Intro to Data Science</h2><p>Learn Scikit-Learn, Pandas, and NumPy.</p>",
        coursePrice: 89.99,
        isPublished: true,
        discount: 10,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/631lFJdQvoo/maxresdefault.jpg"
    },
    {
        courseTitle: "Ethical Hacking 101",
        courseDescription: "<h2>Cybersecurity for Beginners</h2><p>Learn network security and penetration testing.</p>",
        coursePrice: 69.99,
        isPublished: true,
        discount: 20,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/WbV3zRgpw_E/maxresdefault.jpg"
    },
    {
        courseTitle: "SwiftUI iOS App Development",
        courseDescription: "<h2>Build Apps for iPhone</h2><p>Learn SwiftUI and Combine.</p>",
        coursePrice: 129.99,
        isPublished: true,
        discount: 15,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/0yboGn8errU/maxresdefault.jpg"
    },
    {
        courseTitle: "Android Development with Kotlin",
        courseDescription: "<h2>Native Android Apps</h2><p>Learn Jetpack Compose and Retrofit.</p>",
        coursePrice: 119.99,
        isPublished: true,
        discount: 10,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/jZFaMEqEqEQ/maxresdefault.jpg"
    },
    {
        courseTitle: "Docker & Kubernetes for Beginners",
        courseDescription: "<h2>Containerization Essentials</h2><p>Learn to deploy and scale apps.</p>",
        coursePrice: 74.99,
        isPublished: true,
        discount: 20,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/HdLIMoQkXFA/maxresdefault.jpg"
    },
    {
        courseTitle: "GraphQL Mastery",
        courseDescription: "<h2>Next-Gen APIs</h2><p>Learn Apollo Client and Server.</p>",
        coursePrice: 54.99,
        isPublished: true,
        discount: 10,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg"
    },
    {
        courseTitle: "Tailwind CSS from Scratch",
        courseDescription: "<h2>Utility-First CSS</h2><p>Build beautiful websites faster.</p>",
        coursePrice: 29.99,
        isPublished: true,
        discount: 5,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/lpx2zFkapIk/maxresdefault.jpg"
    },
    {
        courseTitle: "Node.js Backend Development",
        courseDescription: "<h2>Scale Your Apps</h2><p>Learn Express, Middleware, and Auth.</p>",
        coursePrice: 64.99,
        isPublished: true,
        discount: 15,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/jZFaMEqEqEQ/maxresdefault.jpg"
    },
    {
        courseTitle: "Unity Game Development",
        courseDescription: "<h2>Build 3D Games</h2><p>Learn C# and Unity Engine.</p>",
        coursePrice: 99.99,
        isPublished: true,
        discount: 25,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/E4znbZgUWzA/maxresdefault.jpg"
    },
    {
        courseTitle: "Next.js 14 Complete Guide",
        courseDescription: "<h2>The Future of React</h2><p>Learn Server Components and Server Actions.</p>",
        coursePrice: 84.99,
        isPublished: true,
        discount: 10,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/631lFJdQvoo/maxresdefault.jpg"
    },
    {
        courseTitle: "Flutter Mobile Development",
        courseDescription: "<h2>Cross-Platform Apps</h2><p>Build for iOS and Android with Dart.</p>",
        coursePrice: 109.99,
        isPublished: true,
        discount: 20,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/WbV3zRgpw_E/maxresdefault.jpg"
    },
    {
        courseTitle: "Typescript for Professionals",
        courseDescription: "<h2>Type-Safe JavaScript</h2><p>Master interfaces, generics, and types.</p>",
        coursePrice: 44.99,
        isPublished: true,
        discount: 10,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/0yboGn8errU/maxresdefault.jpg"
    },
    {
        courseTitle: "Solidity & Web3 Development",
        courseDescription: "<h2>Blockchain Programming</h2><p>Learn Smart Contracts and Ethereum.</p>",
        coursePrice: 149.99,
        isPublished: true,
        discount: 30,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/jZFaMEqEqEQ/maxresdefault.jpg"
    },
    {
        courseTitle: "Rust for Systems Programming",
        courseDescription: "<h2>Fast and Safe Code</h2><p>Learn memory safety and concurrency.</p>",
        coursePrice: 94.99,
        isPublished: true,
        discount: 15,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/HdLIMoQkXFA/maxresdefault.jpg"
    },
    {
        courseTitle: "PostgreSQL Database Mastery",
        courseDescription: "<h2>Relational Data Expert</h2><p>Learn SQL, indexing, and optimization.</p>",
        coursePrice: 59.99,
        isPublished: true,
        discount: 20,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg"
    },
    {
        courseTitle: "Laravel for Rapid Dev",
        courseDescription: "<h2>Elegant PHP Framework</h2><p>Learn Eloquent, Blade, and Routing.</p>",
        coursePrice: 69.99,
        isPublished: true,
        discount: 10,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/lpx2zFkapIk/maxresdefault.jpg"
    },
    {
        courseTitle: "AWS Certified Developer",
        courseDescription: "<h2>Cloud Architect Path</h2><p>Learn S3, EC2, and Lambda.</p>",
        coursePrice: 159.99,
        isPublished: true,
        discount: 20,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/jZFaMEqEqEQ/maxresdefault.jpg"
    },
    {
        courseTitle: "Vue.js 3 Fundamentals",
        courseDescription: "<h2>Progressive Framework</h2><p>Learn Composition API and Pinia.</p>",
        coursePrice: 49.99,
        isPublished: true,
        discount: 10,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/E4znbZgUWzA/maxresdefault.jpg"
    },
    {
        courseTitle: "Angular Pro Bootcamp",
        courseDescription: "<h2>Enterprise-Grade React</h2><p>Learn Signals, RxJS, and DI.</p>",
        coursePrice: 139.99,
        isPublished: true,
        discount: 25,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/631lFJdQvoo/maxresdefault.jpg"
    },
    {
        courseTitle: "Spring Boot for Microservices",
        courseDescription: "<h2>Java Powerhouse</h2><p>Learn Spring Cloud and Netflix OSS.</p>",
        coursePrice: 124.99,
        isPublished: true,
        discount: 15,
        courseContent: [],
        educator: REAL_USER_ID,
        enrolledStudents: [],
        courseRatings: [],
        courseThumbnail: "https://img.youtube.com/vi/WbV3zRgpw_E/maxresdefault.jpg"
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        await Course.deleteMany({});
        await Course.insertMany(courses);
        console.log("Database seeded successfully with 25 courses for EXACT educator: " + REAL_USER_ID);
        process.exit();
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();
