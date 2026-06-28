import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';
import educatorRouter from './routes/educatorRoutes.js';
import { protectEducator, protectUser } from './middleware/auth.js';

const app = express();

await connectDB();

// Middlewares
app.use(cors())
app.use(express.json())

//Routes
app.get('/', (req,res)=>res.send("API is Working"))

// LMS Routes
app.use('/api/course', courseRouter)
app.use('/api/user', protectUser, userRouter)
app.use('/api/educator', protectEducator, educatorRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT,  ()=>{
    console.log("Server is running on port " + PORT);
})

export default app;
