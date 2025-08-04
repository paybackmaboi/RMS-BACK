import express from 'express';
import { createStudentRegistration } from '../controllers/registrationController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Route for admin to create a new student account
router.post('/create', authMiddleware, adminMiddleware, createStudentRegistration);

export default router;