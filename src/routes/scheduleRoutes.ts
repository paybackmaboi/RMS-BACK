import express from 'express';
import { 
    getAllSchedules, 
    getScheduleById, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule,
    getSchedulesBySubject
} from '../controllers/scheduleController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Get all schedules
router.get('/', authMiddleware, getAllSchedules);

// Get schedules by subject
router.get('/subject/:subjectId', authMiddleware, getSchedulesBySubject);

// Get specific schedule
router.get('/:id', authMiddleware, getScheduleById);

// Create new schedule (admin only)
router.post('/', authMiddleware, adminMiddleware, createSchedule);

// Update schedule (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateSchedule);

// Delete schedule (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteSchedule);

export default router; 