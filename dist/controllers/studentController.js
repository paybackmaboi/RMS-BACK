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
exports.createAndEnrollStudent = void 0;
const database_1 = require("../database");
// Helper function to generate a unique ID Number
const generateIdNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentYear = new Date().getFullYear();
    const lastUser = yield database_1.User.findOne({
        where: { idNumber: { [require('sequelize').Op.like]: `${currentYear}-%` } },
        order: [['idNumber', 'DESC']],
    });
    let newSequence = 1;
    if (lastUser) {
        const lastSequence = parseInt(lastUser.idNumber.split('-')[1], 10);
        newSequence = lastSequence + 1;
    }
    // Formats the number to be 4 digits, e.g., 1 becomes 0001
    return `${currentYear}-${String(newSequence).padStart(4, '0')}`;
});
// Helper function to generate a random password
const generatePassword = (length = 6) => {
    return Math.random().toString().substring(2, 2 + length);
};
const createAndEnrollStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, middleName, gender, course } = req.body;
        if (!firstName || !lastName || !course) {
            res.status(400).json({ message: 'First name, last name, and course are required.' });
            return;
        }
        const idNumber = yield generateIdNumber();
        const password = generatePassword();
        // --- START: Update the create call to include names ---
        const newUser = yield database_1.User.create({
            idNumber,
            password,
            role: 'student',
            firstName, // <-- Add this
            lastName, // <-- Add this
            middleName, // <-- Add this
        });
        // --- END: Update the create call ---
        res.status(201).json({
            message: 'Student account created successfully!',
            user: {
                id: newUser.id,
                idNumber: newUser.idNumber,
                password: password,
                name: `${lastName}, ${firstName} ${middleName || ''}`,
                gender,
                course,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createAndEnrollStudent = createAndEnrollStudent;
