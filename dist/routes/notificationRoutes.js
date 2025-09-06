"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const router = express_1.default.Router();
// Route to get a user's notifications
router.get('/', sessionAuthMiddleware_1.studentSessionAuthMiddleware, notificationController_1.getMyNotifications);
// Route to get notifications by student ID (admin only)
router.get('/student/:studentId', sessionAuthMiddleware_1.adminSessionAuthMiddleware, notificationController_1.getNotificationsByStudentId);
// Route to mark all notifications as read
router.patch('/read', sessionAuthMiddleware_1.studentSessionAuthMiddleware, notificationController_1.markAllAsRead);
router.delete('/', sessionAuthMiddleware_1.studentSessionAuthMiddleware, notificationController_1.clearAllNotifications);
exports.default = router;
