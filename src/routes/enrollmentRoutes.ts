import express from 'express';
import { 
    createEnrollment, 
    getEnrollments, 
    getEnrollmentById, 
    updateEnrollment, 
    deleteEnrollment,
    getStudentEnrollments
} from '../controllers/enrollmentController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Get all enrollments (admin only)
router.get('/', authMiddleware, adminMiddleware, getEnrollments);

// Get enrollments for current student
router.get('/my-enrollments', authMiddleware, getStudentEnrollments);

// Get specific enrollment
router.get('/:id', authMiddleware, getEnrollmentById);

// Create new enrollment
router.post('/', authMiddleware, createEnrollment);

// Update enrollment
router.put('/:id', authMiddleware, adminMiddleware, updateEnrollment);

// Delete enrollment
router.delete('/:id', authMiddleware, adminMiddleware, deleteEnrollment);

export default router; 