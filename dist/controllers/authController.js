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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idNumber, password } = req.body;
    try {
        const user = yield database_1.User.findOne({ where: { idNumber } });
        if (!user) {
            // FIX: Removed 'return' from res.json() to prevent the function from returning a 'Response' object.
            res.status(400).json({ message: 'Invalid ID Number or password.' });
            return; // Explicitly return to exit the function.
        }
        // NOTE: Using '(user as any)' to call a custom method. Ensure 'comparePassword' exists on your User model.
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            // FIX: Removed 'return' here as well.
            res.status(400).json({ message: 'Invalid ID Number or password.' });
            return; // Explicitly return to exit the function.
        }
        const token = jsonwebtoken_1.default.sign(
        // NOTE: Using '(user as any)' to access model properties.
        { id: user.id, idNumber: user.idNumber, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user.id,
                idNumber: user.idNumber,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                course: user.course,
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        next(error); // Pass the error to the error-handling middleware
    }
});
exports.login = login;
