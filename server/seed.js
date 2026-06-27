import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog.js';
import Comment from './models/Comments.js';

dotenv.config();

const blog_data = [
    {
        "title": "The Future of AI in Software Development",
        "subTitle": "How AI is changing the way we write code",
        "description": "<h2>Introduction to AI in Dev</h2><p>AI is no longer just a buzzword. It is actively helping developers write better code faster. Tools like GitHub Copilot and Cursor are leading the charge.</p><h3>Key Benefits</h3><ul><li>Faster boilerplate generation</li><li>Real-time bug detection</li><li>Automated documentation</li></ul><p>As we move forward, AI will likely handle more architectural decisions, but human oversight remains critical.</p>",
        "category": "Technology",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_3.png",
        "isPublished": true
    },
    {
        "title": "Bootstrap vs Venture Capital: Choosing Your Path",
        "subTitle": "Deciding how to fund your startup growth",
        "description": "<h2>The Funding Dilemma</h2><p>Should you build slowly with your own money or grow fast with investor cash? Both have pros and cons.</p><h3>Bootstrapping</h3><p>You keep 100% control, but growth might be slower. It forces you to be profitable from day one.</p><h3>Venture Capital</h3><p>Fast growth, but you lose equity and answer to a board. Ideal for winner-take-all markets.</p>",
        "category": "Startup",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_2.png",
        "isPublished": true
    },
    {
        "title": "10 Habits for a High-Performance Lifestyle",
        "subTitle": "Small changes that lead to massive results",
        "description": "<h2>Success Starts with Habits</h2><p>Your daily routine determines your future. Here are 10 habits of high performers:</p><ol><li>Wake up early</li><li>Exercise daily</li><li>Meditation</li><li>Deep work blocks</li><li>Continuous learning</li><li>Healthy eating</li><li>Adequate sleep</li><li>Networking</li><li>Financial planning</li><li>Gratitude journal</li></ol>",
        "category": "Lifestyle",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_1.png",
        "isPublished": true
    },
    {
        "title": "Mastering Personal Finance in Your 20s",
        "subTitle": "Building a solid foundation for wealth",
        "description": "<h2>Start Early, Retire Rich</h2><p>The power of compound interest is your best friend. Start by saving 20% of your income.</p><h3>The 50/30/20 Rule</h3><p>50% for needs, 30% for wants, and 20% for savings and debt repayment. Avoid lifestyle creep!</p>",
        "category": "Finance",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_7.png",
        "isPublished": true
    },
    {
        "title": "The Rise of No-Code Development",
        "subTitle": "Building applications without writing a line of code",
        "description": "<h2>The No-Code Revolution</h2><p>Platforms like Bubble, Webflow, and Zapier are empowering non-technical founders to build complex apps.</p><p>This democratization of technology is leading to a surge in new digital products from diverse creators.</p>",
        "category": "Technology",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_4.png",
        "isPublished": true
    },
    {
        "title": "Finding Your Product-Market Fit",
        "subTitle": "The holy grail of every early-stage startup",
        "description": "<h2>What is PMF?</h2><p>PMF is when you have built a product that people are actually willing to pay for and keep using.</p><p>Listen to your users, iterate fast, and don't be afraid to pivot if the data shows your current path isn't working.</p>",
        "category": "Startup",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_6.png",
        "isPublished": true
    },
    {
        "title": "The Importance of Digital Detox",
        "subTitle": "Why you need to step away from the screen",
        "description": "<h2>Reclaiming Your Attention</h2><p>Constant notifications are killing our focus. A digital detox helps reset your brain and reduce anxiety.</p><p>Try setting 'no-phone zones' in your house or dedicated offline hours every weekend.</p>",
        "category": "Lifestyle",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_5.png",
        "isPublished": true
    },
    {
        "title": "Understanding Cryptocurrency and Web3",
        "subTitle": "Navigating the world of decentralized finance",
        "description": "<h2>Beyond the Hype</h2><p>Blockchain technology is about more than just Bitcoin. It's about decentralizing the internet and ownership.</p><p>Learn the basics of wallets, smart contracts, and DeFi before investing significant capital.</p>",
        "category": "Finance",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_8.png",
        "isPublished": true
    },
    {
        "title": "Cybersecurity Best Practices for 2025",
        "subTitle": "Protecting your data in an increasingly digital world",
        "description": "<h2>Stay Safe Online</h2><p>Threats are evolving. Basic password hygiene is no longer enough.</p><ul><li>Use MFA everywhere</li><li>Use a password manager</li><li>Keep software updated</li><li>Be wary of phishing</li></ul>",
        "category": "Technology",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_10.png",
        "isPublished": true
    },
    {
        "title": "Hiring Your First Startup Team",
        "subTitle": "How to find people who share your vision",
        "description": "<h2>The Foundation of Culture</h2><p>Your first 10 employees will define your company culture. Hire for passion and adaptability, not just skills.</p><p>Look for 'A-players' who are comfortable with ambiguity and fast-paced environments.</p>",
        "category": "Startup",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_2.png",
        "isPublished": true
    },
    {
        "title": "The Art of Mindful Living",
        "subTitle": "Finding peace in a chaotic world",
        "description": "<h2>Be Present</h2><p>Mindfulness is about being fully engaged in whatever you are doing right now.</p><p>Practicing mindfulness can lead to better emotional regulation and increased happiness.</p>",
        "category": "Lifestyle",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_9.png",
        "isPublished": true
    },
    {
        "title": "Real Estate Investing for Beginners",
        "subTitle": "Building wealth through property",
        "description": "<h2>Tangible Assets</h2><p>Real estate has historically been one of the safest ways to build long-term wealth.</p><p>Start by researching your local market and understanding the difference between residential and commercial investments.</p>",
        "category": "Finance",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_7.png",
        "isPublished": true
    },
    {
        "title": "The Impact of 5G on Global Connectivity",
        "subTitle": "Faster speeds and new possibilities",
        "description": "<h2>Connecting the World</h2><p>5G is not just about faster phones. It's about enabling IoT, autonomous vehicles, and remote surgery.</p><p>The infrastructure is still being built, but the potential for innovation is limitless.</p>",
        "category": "Technology",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_3.png",
        "isPublished": true
    },
    {
        "title": "Scaling Your Startup: Challenges and Solutions",
        "subTitle": "Moving from startup to scaleup",
        "description": "<h2>Growth Pains</h2><p>Scaling requires a different mindset than starting. You need processes, management layers, and clear communication.</p><p>Focus on maintaining your core values while building the infrastructure needed for high-volume growth.</p>",
        "category": "Startup",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_6.png",
        "isPublished": true
    },
    {
        "title": "Traveling on a Budget: Pro Tips",
        "subTitle": "See the world without breaking the bank",
        "description": "<h2>Experience Over Luxury</h2><p>Travel doesn't have to be expensive. Hostels, street food, and public transport can save you thousands.</p><p>Travel in the off-season and use flight comparison tools to find the best deals.</p>",
        "category": "Lifestyle",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_5.png",
        "isPublished": true
    },
    {
        "title": "The Psychology of Spending",
        "subTitle": "Why we buy things we don't need",
        "description": "<h2>Understanding Your Brain</h2><p>Marketing is designed to trigger emotional responses. Understanding these triggers can help you make better financial decisions.</p><p>Wait 24 hours before making any major purchase to ensure it's a need, not an impulse.</p>",
        "category": "Finance",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_8.png",
        "isPublished": true
    },
    {
        "title": "Web Development Trends for 2025",
        "subTitle": "What every developer should know",
        "description": "<h2>The Modern Web</h2><p>Server-side rendering, edge computing, and AI integration are the key trends defining the web today.</p><p>Keep learning and stay updated with frameworks like Next.js and Tailwind CSS.</p>",
        "category": "Technology",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_4.png",
        "isPublished": true
    },
    {
        "title": "Building a Personal Brand in Tech",
        "subTitle": "Standing out in a crowded market",
        "description": "<h2>You are a Product</h2><p>Whether you're an employee or a founder, your personal brand matters. Share your knowledge on LinkedIn and GitHub.</p><p>Consistency is key. Provide value to your community, and opportunities will follow.</p>",
        "category": "Startup",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_2.png",
        "isPublished": true
    },
    {
        "title": "The Benefits of Regular Exercise",
        "subTitle": "More than just physical health",
        "description": "<h2>Mind and Body</h2><p>Exercise is one of the best things you can do for your mental health. It reduces stress and improves mood.</p><p>Find an activity you enjoy, and aim for at least 30 minutes of movement most days.</p>",
        "category": "Lifestyle",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_1.png",
        "isPublished": true
    },
    {
        "title": "Investing in the Stock Market: A Primer",
        "subTitle": "How to get started with stocks",
        "description": "<h2>Wealth Building 101</h2><p>Stocks represent ownership in a company. Diversification through index funds is a great strategy for beginners.</p><p>Don't try to time the market. Consistent, long-term investing is the key to success.</p>",
        "category": "Finance",
        "image": "https://ik.imagekit.io/5ncomb1hs/blogs/blog_pic_7.png",
        "isPublished": true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");

        // Clear existing data to avoid duplicates
        await Blog.deleteMany({});
        await Comment.deleteMany({});
        console.log("Existing blogs and comments deleted.");

        const insertedBlogs = await Blog.insertMany(blog_data);
        console.log("20 sample blog records inserted successfully!");

        // Generate sample comments for the first few blogs
        const sampleComments = [];
        const names = ["Alice Smith", "Bob Jones", "Charlie Brown", "Diana Prince", "Ethan Hunt"];
        const contents = [
            "Great article! Very insightful.",
            "I learned a lot from this, thank you for sharing.",
            "Could you elaborate more on the second point?",
            "I completely agree with your perspective on this.",
            "This is exactly what I was looking for. Excellent work!"
        ];

        // Add 2 approved comments to each inserted blog
        insertedBlogs.forEach(blog => {
            for (let i = 0; i < 2; i++) {
                sampleComments.push({
                    blog: blog._id,
                    name: names[Math.floor(Math.random() * names.length)],
                    content: contents[Math.floor(Math.random() * contents.length)],
                    isApproved: true
                });
            }
        });

        await Comment.insertMany(sampleComments);
        console.log("Sample comments inserted and approved successfully!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

seedDB();
