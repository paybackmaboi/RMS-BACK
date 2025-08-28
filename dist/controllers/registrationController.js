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
exports.createStudentRegistration = void 0;
const database_1 = require("../database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createStudentRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idNumber, password, firstName, lastName, middleName, email, phoneNumber, courseId } = req.body;
        // Check if user already exists
        const existingUser = yield database_1.UserModel.findOne({ where: { idNumber } });
        if (existingUser) {
            res.status(400).json({ message: 'User with this ID number already exists.' });
            return;
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create user first
        const newUser = yield database_1.UserModel.create({
            idNumber,
            password: hashedPassword,
            firstName,
            lastName,
            middleName,
            email,
            phoneNumber,
            role: 'student',
            isActive: true
        });
        res.status(201).json({
            message: 'Student account created successfully. Please complete your registration.',
            user: {
                id: newUser.id,
                idNumber: newUser.idNumber,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createStudentRegistration = createStudentRegistration;
