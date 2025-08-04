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
exports.registerStudent = void 0;
const database_1 = require("../database");
// Controller to handle the new student registration
const registerStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the ID of the currently logged-in user from the auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: You must be logged in to register.' });
            return;
        }
        // Check if this user already has a student record
        const existingStudent = yield database_1.Student.findOne({ where: { userId } });
        if (existingStudent) {
            res.status(400).json({ message: 'This user has already completed their registration.' });
            return;
        }
        // Get the personal data from the form
        const { gender, dateOfBirth, placeOfBirth, civilStatus, religion, parentGuardian, permanentAddress, previousSchool, yearOfEntry } = req.body;
        // Create the detailed student record and associate it with the logged-in user
        const newStudent = yield database_1.Student.create({
            userId, // Use the ID from the logged-in user
            gender,
            dateOfBirth,
            placeOfBirth,
            civilStatus,
            religion,
            parentGuardian,
            permanentAddress,
            previousSchool,
            yearOfEntry
        });
        res.status(201).json({ message: 'Student registered successfully!', studentId: newStudent.id });
    }
    catch (error) {
        next(error);
    }
});
exports.registerStudent = registerStudent;
