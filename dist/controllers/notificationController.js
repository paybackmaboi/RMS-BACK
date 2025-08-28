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
exports.clearAllNotifications = exports.markAllAsRead = exports.getMyNotifications = void 0;
const database_1 = require("../database");
// Get all notifications for the logged-in user
const getMyNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const notifications = yield database_1.NotificationModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20 // Limit to the last 20 notifications for performance
        });
        res.json(notifications);
    }
    catch (error) {
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
        next(error);
    }
});
exports.clearAllNotifications = clearAllNotifications;
