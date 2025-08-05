"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Route to get a user's notifications
router.get('/', authMiddleware_1.authMiddleware, notificationController_1.getMyNotifications);
// Route to mark all notifications as read
router.patch('/read', authMiddleware_1.authMiddleware, notificationController_1.markAllAsRead);
router.delete('/', authMiddleware_1.authMiddleware, notificationController_1.clearAllNotifications);
exports.default = router;
