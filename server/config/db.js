// import mongoose, { connect } from "mongoose";

// const connectDB = async()=>{
//     try{ 
//         mongoose.connection.on('connected',()=> console.log("Database connected"))
//         await mongoose.connect(process.env.MONGODB_URI);
//     }catch(error){
//         console.log(error.message);
//     }
// }

// export default connectDB;

import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully ✅");
      console.log(`--- DB CONNECTION INFO ---`);
      console.log(`Host: ${mongoose.connection.host}`);
      console.log(`Database Name: ${mongoose.connection.name}`);
      console.log(`---------------------------`);
    });

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing!");
    }

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("MongoDB connection error ❌:", error.message);
    process.exit(1);
  }
};

export default connectDB;
