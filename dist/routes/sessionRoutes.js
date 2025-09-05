"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sessionController_1 = require("../controllers/sessionController");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const router = express_1.default.Router();
// Login and create session
router.post('/login', sessionController_1.loginAndCreateSession);
// Logout and destroy session
router.post('/logout', sessionAuthMiddleware_1.sessionAuthMiddleware, sessionController_1.logoutAndDestroySession);
// Get current session info
router.get('/me', sessionAuthMiddleware_1.sessionAuthMiddleware, sessionController_1.getCurrentSession);
// Refresh session (no auth required - just need valid session token)
router.post('/refresh', sessionController_1.refreshSession);
// Get login/logout history
router.get('/history', sessionAuthMiddleware_1.sessionAuthMiddleware, sessionController_1.getLoginHistory);
// Get student login history (admin only)
router.get('/student/:studentId/history', sessionAuthMiddleware_1.adminSessionAuthMiddleware, sessionController_1.getStudentLoginHistory);
exports.default = router;
