"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrationController_1 = require("../controllers/registrationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Route for admin to create a new student account
router.post('/create', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, registrationController_1.createStudentRegistration);
exports.default = router;
