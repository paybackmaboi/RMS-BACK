"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const sessionAuthMiddleware_1 = require("../middleware/sessionAuthMiddleware");
const router = express_1.default.Router();
// Dashboard statistics endpoint
router.get('/stats', sessionAuthMiddleware_1.adminSessionAuthMiddleware, dashboardController_1.getDashboardStats);
// Recent activity endpoint
router.get('/recent-activity', sessionAuthMiddleware_1.adminSessionAuthMiddleware, dashboardController_1.getRecentActivity);
exports.default = router;
