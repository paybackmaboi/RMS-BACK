import express from 'express';
import {
    createAndEnrollStudent,
    getRegistrationStatus,
    getAllStudents,
    getStudentDetails,
    updateStudent,
    deleteStudent,
    registerStudent,
    debugStudentRegistration
} from '../controllers/studentController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Student registration
router.post('/register', registerStudent);

// Debug endpoint
router.get('/debug', authMiddleware, debugStudentRegistration);

// Admin routes for student management
router.get('/', authMiddleware, adminMiddleware, getAllStudents);
router.get('/:id', authMiddleware, adminMiddleware, getStudentDetails);
router.put('/:id', authMiddleware, adminMiddleware, updateStudent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteStudent);

// Create and enroll student (admin only)
router.post('/create-and-enroll', authMiddleware, adminMiddleware, createAndEnrollStudent);

export default router;
