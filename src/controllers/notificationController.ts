import { Request, Response, NextFunction } from 'express';
import { NotificationModel } from '../database';

// Get all notifications for the logged-in user
export const getMyNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔍 Notification controller - req.user:', req.user);
        console.log('🔍 Notification controller - req.headers:', req.headers);
        
        const userId = req.user?.id;
        console.log('🔍 Notification controller - User ID from req.user:', userId);
        if (!userId) {
            console.log('❌ No user ID found in request');
            console.log('❌ Full req.user object:', req.user);
            res.status(401).json({ message: 'Unauthorized: No user ID found' });
            return;
        }
        const notifications = await NotificationModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20 // Limit to the last 20 notifications for performance
        });
        
        console.log('✅ Notification controller - Successfully fetched notifications for user ID:', userId);
        console.log('✅ Notification controller - Number of notifications found:', notifications.length);
        
        res.json(notifications);
    } catch (error) {
        console.error('❌ Notification controller getMyNotifications error:', error);
        console.error('❌ Notification controller getMyNotifications error stack:', error instanceof Error ? error.stack : 'No stack trace');
        next(error);
    }
};

// Mark all notifications as read for the logged-in user
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await NotificationModel.update({ isRead: true }, {
            where: { userId, isRead: false }
        });
        res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
        console.error('❌ Notification controller markAllAsRead error:', error);
        console.error('❌ Notification controller markAllAsRead error stack:', error instanceof Error ? error.stack : 'No stack trace');
        next(error);
    }
};

export const clearAllNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await NotificationModel.destroy({
            where: { userId }
        });
        res.status(200).json({ message: 'All notifications cleared.' });
    } catch (error) {
        console.error('❌ Notification controller clearAllNotifications error:', error);
        console.error('❌ Notification controller clearAllNotifications error stack:', error instanceof Error ? error.stack : 'No stack trace');
        next(error);
    }
};

// Get notifications by student ID (admin function)
export const getNotificationsByStudentId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            res.status(400).json({ message: 'Student ID is required' });
            return;
        }

        const notifications = await NotificationModel.findAll({
            where: { userId: studentId },
            order: [['createdAt', 'DESC']],
            limit: 50 // Allow more notifications for admin view
        });
        
        console.log(`✅ Admin fetched ${notifications.length} notifications for student ID: ${studentId}`);
        res.json(notifications);
    } catch (error) {
        console.error('❌ Notification controller getNotificationsByStudentId error:', error);
        next(error);
    }
};