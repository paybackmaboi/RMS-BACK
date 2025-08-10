import express from 'express';
import {
    getAllCourses,
    getCourseById,
    getCoursesByDepartment,
    createCourse,
    updateCourse,
    deleteCourse
} from '../controllers/courseController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (no admin required for viewing courses)
router.get('/', getAllCourses);
router.get('/department/:departmentId', authMiddleware, getCoursesByDepartment);
router.get('/:id', authMiddleware, getCourseById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.put('/:id', authMiddleware, adminMiddleware, updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse);

export default router; 