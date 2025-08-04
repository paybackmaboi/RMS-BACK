"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrationController_1 = require("../controllers/registrationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// This route will handle the student registration form submission
router.post('/student', authMiddleware_1.authMiddleware, registrationController_1.registerStudent);
exports.default = router;
