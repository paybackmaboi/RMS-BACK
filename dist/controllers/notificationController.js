"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationsByStudentId = exports.clearAllNotifications = exports.markAllAsRead = exports.getMyNotifications = void 0;
const database_1 = require("../database");
// Get all notifications for the logged-in user
const getMyNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('🔍 Notification controller - req.user:', req.user);
        console.log('🔍 Notification controller - req.headers:', req.headers);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log('🔍 Notification controller - User ID from req.user:', userId);
        if (!userId) {
            console.log('❌ No user ID found in request');
            console.log('❌ Full req.user object:', req.user);
            res.status(401).json({ message: 'Unauthorized: No user ID found' });
            return;
        }
        const notifications = yield database_1.NotificationModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20 // Limit to the last 20 notifications for performance
        });
        console.log('✅ Notification controller - Successfully fetched notifications for user ID:', userId);
        console.log('✅ Notification controller - Number of notifications found:', notifications.length);
        res.json(notifications);
    }
    catch (error) {
        console.error('❌ Notification controller getMyNotifications error:', error);
        console.error('❌ Notification controller getMyNotifications error stack:', error instanceof Error ? error.stack : 'No stack trace');
        next(error);
    }
});
exports.getMyNotifications = getMyNotifications;
// Mark all notifications as read for the logged-in user
const markAllAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        yield database_1.NotificationModel.update({ isRead: true }, {
            where: { userId, isRead: false }
        });
        res.status(200).json({ message: 'All notifications marked as read.' });
    }
    catch (error) {
        console.error('❌ Notification controller markAllAsRead error:', error);
        console.error('❌ Notification controller markAllAsRead error stack:', error instanceof Error ? error.stack : 'No stack trace');
        next(error);
    }
});
exports.markAllAsRead = markAllAsRead;
const clearAllNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        yield database_1.NotificationModel.destroy({
            where: { userId }
        });
        res.status(200).json({ message: 'All notifications cleared.' });
    }
    catch (error) {
        console.error('❌ Notification controller clearAllNotifications error:', error);
        console.error('❌ Notification controller clearAllNotifications error stack:', error instanceof Error ? error.stack : 'No stack trace');
        next(error);
    }
});
exports.clearAllNotifications = clearAllNotifications;
// Get notifications by student ID (admin function)
const getNotificationsByStudentId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        if (!studentId) {
            res.status(400).json({ message: 'Student ID is required' });
            return;
        }
        const notifications = yield database_1.NotificationModel.findAll({
            where: { userId: studentId },
            order: [['createdAt', 'DESC']],
            limit: 50 // Allow more notifications for admin view
        });
        console.log(`✅ Admin fetched ${notifications.length} notifications for student ID: ${studentId}`);
        res.json(notifications);
    }
    catch (error) {
        console.error('❌ Notification controller getNotificationsByStudentId error:', error);
        next(error);
    }
});
exports.getNotificationsByStudentId = getNotificationsByStudentId;
