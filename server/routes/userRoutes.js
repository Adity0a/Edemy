import express from 'express';
import { getUserData, userEnrolledCourses, purchaseCourse, updateCourseProgress, getUserCourseProgress, addRating } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
userRouter.post('/update-progress', updateCourseProgress);
userRouter.post('/get-progress', getUserCourseProgress);
userRouter.post('/add-rating', addRating);

export default userRouter;
