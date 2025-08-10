import express from 'express';
import { 
    getAllSubjects, 
    getSubjectById, 
    createSubject, 
    updateSubject, 
    deleteSubject,
    getSubjectsByCourse
} from '../controllers/subjectController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Get all subjects
router.get('/', authMiddleware, getAllSubjects);

// Get subjects by course
router.get('/course/:course', authMiddleware, getSubjectsByCourse);

// Get specific subject
router.get('/:id', authMiddleware, getSubjectById);

// Create new subject (admin only)
router.post('/', authMiddleware, adminMiddleware, createSubject);

// Update subject (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateSubject);

// Delete subject (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteSubject);

export default router; 