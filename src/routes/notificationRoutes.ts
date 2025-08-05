import express from 'express';
import { getMyNotifications, markAllAsRead, clearAllNotifications } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Route to get a user's notifications
router.get('/', authMiddleware, getMyNotifications);

// Route to mark all notifications as read
router.patch('/read', authMiddleware, markAllAsRead);
router.delete('/', authMiddleware, clearAllNotifications);

export default router;