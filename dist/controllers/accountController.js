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
exports.resetStudentPassword = exports.getAllStudentAccounts = void 0;
const database_1 = require("../database");
// Helper function to generate a new random password
const generatePassword = (length = 6) => {
    return Math.random().toString().substring(2, 2 + length);
};
// This function will fetch all users with the 'student' role
const getAllStudentAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentAccounts = yield database_1.User.findAll({
            where: { role: 'student' },
            attributes: ['id', 'idNumber', 'firstName', 'lastName', 'middleName', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
        res.json(studentAccounts);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllStudentAccounts = getAllStudentAccounts;
// --- START: Add this new function ---
const resetStudentPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield database_1.User.findByPk(id);
        if (!user || user.role !== 'student') {
            res.status(404).json({ message: 'Student account not found.' });
            return;
        }
        const newPassword = generatePassword();
        // The beforeUpdate hook in your User model will automatically hash this new password
        user.password = newPassword;
        yield user.save();
        // Return the new, un-hashed password to the admin
        res.json({
            message: 'Password reset successfully.',
            idNumber: user.idNumber,
            newPassword: newPassword,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetStudentPassword = resetStudentPassword;
// --- END: Add this new function ---
