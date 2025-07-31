"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountController_1 = require("../controllers/accountController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Existing route to get all accounts
router.get('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, accountController_1.getAllStudentAccounts);
router.patch('/:id/reset-password', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, accountController_1.resetStudentPassword);
exports.default = router;
