import express from 'express';
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudents, updateCourse, deleteCourse, debugEducatorIds } from '../controllers/educatorController.js';

const educatorRouter = express.Router();

educatorRouter.get('/debug-ids', debugEducatorIds);
educatorRouter.post('/add-course', addCourse);
educatorRouter.get('/courses', getEducatorCourses);
educatorRouter.get('/dashboard-data', educatorDashboardData);
educatorRouter.get('/enrolled-students', getEnrolledStudents);
educatorRouter.put('/update-course/:id', updateCourse);
educatorRouter.delete('/delete-course/:id', deleteCourse);

export default educatorRouter;
