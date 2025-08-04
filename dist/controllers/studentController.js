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
exports.debugStudentRegistration = exports.registerStudent = exports.deleteStudent = exports.updateStudent = exports.getStudentDetails = exports.getAllStudents = exports.getRegistrationStatus = exports.createAndEnrollStudent = void 0;
const database_1 = require("../database");
// Helper function to generate a unique ID Number
const generateIdNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentYear = new Date().getFullYear();
    const lastUser = yield database_1.User.findOne({
        where: { idNumber: { [require('sequelize').Op.like]: `${currentYear}-%` } },
        order: [['idNumber', 'DESC']],
    });
    if (lastUser) {
        const lastNumber = parseInt(lastUser.idNumber.split('-')[1]);
        return `${currentYear}-${String(lastNumber + 1).padStart(4, '0')}`;
    }
    return `${currentYear}-0001`;
});
// Helper function to generate a random password
const generatePassword = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
const createAndEnrollStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, middleName, gender, courseId } = req.body;
        const idNumber = yield generateIdNumber();
        const password = generatePassword();
        const newUser = yield database_1.User.create({
            idNumber,
            password,
            role: 'student',
            firstName,
            lastName,
            middleName,
            isActive: true
        });
        res.status(201).json({
            message: 'Student account created successfully!',
            user: {
                id: newUser.id,
                idNumber: newUser.idNumber,
                password: password,
                name: `${lastName}, ${firstName} ${middleName || ''}`,
                gender
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createAndEnrollStudent = createAndEnrollStudent;
const getRegistrationStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const student = yield database_1.Student.findOne({ where: { userId } });
        res.json({ isRegistered: !!student });
    }
    catch (error) {
        next(error);
    }
});
exports.getRegistrationStatus = getRegistrationStatus;
const getAllStudents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield database_1.User.findAll({
            where: { role: 'student', isActive: true },
            include: [
                {
                    model: database_1.Student,
                    as: 'studentDetails',
                    include: [
                        {
                            model: database_1.Course,
                            as: 'course'
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        const formattedStudents = students.map(student => {
            var _a;
            const studentDetails = student.get('studentDetails');
            return {
                id: student.id,
                idNumber: student.idNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                middleName: student.middleName,
                email: student.email,
                phoneNumber: student.phoneNumber,
                isRegistered: !!studentDetails,
                course: ((_a = studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.course) === null || _a === void 0 ? void 0 : _a.name) || 'Not registered',
                studentNumber: (studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.studentNumber) || null,
                fullName: (studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.fullName) || `${student.firstName} ${student.lastName}`,
                academicStatus: (studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.academicStatus) || 'Not registered'
            };
        });
        res.json(formattedStudents);
    }
    catch (error) {
        console.error('Error fetching all students:', error);
        next(error);
    }
});
exports.getAllStudents = getAllStudents;
const getStudentDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield database_1.User.findByPk(id, {
            include: [
                {
                    model: database_1.Student,
                    as: 'studentDetails',
                    include: [
                        {
                            model: database_1.Course,
                            as: 'course'
                        }
                    ]
                }
            ]
        });
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }
        res.json(student);
    }
    catch (error) {
        next(error);
    }
});
exports.getStudentDetails = getStudentDetails;
const updateStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const student = yield database_1.User.findByPk(id);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }
        // Update user data
        yield student.update(updateData);
        // Update student details if they exist
        const studentDetails = yield database_1.Student.findOne({ where: { userId: id } });
        if (studentDetails) {
            yield studentDetails.update(updateData);
        }
        res.json({ message: 'Student updated successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield database_1.User.findByPk(id);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }
        // Soft delete by setting isActive to false
        yield student.update({ isActive: false });
        // Also soft delete student details if they exist
        const studentDetails = yield database_1.Student.findOne({ where: { userId: id } });
        if (studentDetails) {
            yield studentDetails.update({ isActive: false });
        }
        res.json({ message: 'Student deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteStudent = deleteStudent;
const registerStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { 
        // I. PERSONAL DATA
        fullName, gender, maritalStatus, dateOfBirth, placeOfBirth, email, contactNumber, religion, citizenship, country, acrNumber, cityAddress, cityTelNumber, provincialAddress, provincialTelNumber, 
        // II. FAMILY BACKGROUND
        // Father's Information
        fatherName, fatherAddress, fatherOccupation, fatherCompany, fatherContactNumber, fatherIncome, 
        // Mother's Information
        motherName, motherAddress, motherOccupation, motherCompany, motherContactNumber, motherIncome, 
        // Guardian's Information
        guardianName, guardianAddress, guardianOccupation, guardianCompany, guardianContactNumber, guardianIncome, 
        // III. CURRENT ACADEMIC BACKGROUND
        courseId, major, studentType, semesterEntry, yearOfEntry, estimatedYearOfGraduation, applicationType, 
        // IV. ACADEMIC HISTORY
        // Elementary
        elementarySchool, elementaryAddress, elementaryHonor, elementaryYearGraduated, 
        // Junior High School
        juniorHighSchool, juniorHighAddress, juniorHighHonor, juniorHighYearGraduated, 
        // Senior High School
        seniorHighSchool, seniorHighAddress, seniorHighStrand, seniorHighHonor, seniorHighYearGraduated, 
        // Additional Academic Information
        ncaeGrade, specialization, lastCollegeAttended, lastCollegeYearTaken, lastCollegeCourse, lastCollegeMajor } = req.body;
        // Validate required fields
        const requiredFields = [
            'fullName', 'gender', 'maritalStatus', 'dateOfBirth', 'placeOfBirth',
            'email', 'contactNumber', 'religion', 'citizenship', 'country',
            'cityAddress', 'provincialAddress', 'fatherName', 'fatherAddress',
            'fatherOccupation', 'fatherContactNumber', 'motherName', 'motherAddress',
            'motherOccupation', 'motherContactNumber', 'guardianName', 'guardianAddress',
            'guardianOccupation', 'guardianContactNumber', 'studentType',
            'semesterEntry', 'yearOfEntry', 'applicationType'
            // Removed courseId, elementary, junior high, and senior high requirements
            // since this is tertiary level only and course can be selected later
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                res.status(400).json({ message: `${field} is required` });
                return;
            }
        }
        // Generate student number
        const studentNumber = `STU${Date.now()}`;
        // Create student record with ALL fields from SPR form
        const student = yield database_1.Student.create({
            userId,
            courseId: courseId ? parseInt(courseId) : null, // Make courseId optional
            studentNumber,
            // I. PERSONAL DATA
            fullName,
            gender,
            maritalStatus,
            dateOfBirth: new Date(dateOfBirth),
            placeOfBirth,
            email,
            contactNumber,
            religion,
            citizenship,
            country,
            acrNumber,
            cityAddress,
            cityTelNumber,
            provincialAddress,
            provincialTelNumber,
            // II. FAMILY BACKGROUND
            // Father's Information
            fatherName,
            fatherAddress,
            fatherOccupation,
            fatherCompany,
            fatherContactNumber,
            fatherIncome,
            // Mother's Information
            motherName,
            motherAddress,
            motherOccupation,
            motherCompany,
            motherContactNumber,
            motherIncome,
            // Guardian's Information
            guardianName,
            guardianAddress,
            guardianOccupation,
            guardianCompany,
            guardianContactNumber,
            guardianIncome,
            // III. CURRENT ACADEMIC BACKGROUND
            major,
            studentType,
            semesterEntry,
            yearOfEntry: parseInt(yearOfEntry),
            estimatedYearOfGraduation: estimatedYearOfGraduation ? parseInt(estimatedYearOfGraduation) : null,
            applicationType,
            // IV. ACADEMIC HISTORY
            // Elementary
            elementarySchool,
            elementaryAddress,
            elementaryHonor,
            elementaryYearGraduated: parseInt(elementaryYearGraduated),
            // Junior High School
            juniorHighSchool,
            juniorHighAddress,
            juniorHighHonor,
            juniorHighYearGraduated: parseInt(juniorHighYearGraduated),
            // Senior High School
            seniorHighSchool,
            seniorHighAddress,
            seniorHighStrand,
            seniorHighHonor,
            seniorHighYearGraduated: parseInt(seniorHighYearGraduated),
            // Additional Academic Information
            ncaeGrade,
            specialization,
            lastCollegeAttended,
            lastCollegeYearTaken: lastCollegeYearTaken ? parseInt(lastCollegeYearTaken) : null,
            lastCollegeCourse,
            lastCollegeMajor,
            // Academic Status
            academicStatus: 'Regular',
            currentYearLevel: 1,
            currentSemester: 1,
            totalUnitsEarned: 0,
            cumulativeGPA: 0.00,
            isActive: true
        });
        res.status(201).json({
            message: 'Student registration completed successfully',
            student: {
                id: student.id,
                studentNumber: student.studentNumber,
                fullName: student.fullName,
                courseId: student.courseId
            }
        });
    }
    catch (error) {
        console.error('Error registering student:', error);
        next(error);
    }
});
exports.registerStudent = registerStudent;
const debugStudentRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Check if user exists
        const user = yield database_1.User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if student record exists
        const student = yield database_1.Student.findOne({ where: { userId } });
        res.json({
            user: {
                id: user.id,
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            student: student ? {
                id: student.id,
                studentNumber: student.studentNumber,
                fullName: student.fullName,
                courseId: student.courseId,
                academicStatus: student.academicStatus
            } : null,
            isRegistered: !!student
        });
    }
    catch (error) {
        console.error('Error in debug endpoint:', error);
        next(error);
    }
});
exports.debugStudentRegistration = debugStudentRegistration;
