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
// Enhanced function to fetch all students with registration and enrollment data
const getAllStudentAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching students from database...');
        // Only fetch students who have completed their registration form
        const students = yield database_1.UserModel.findAll({
            where: { role: 'student', isActive: true },
            include: [
                {
                    model: database_1.StudentModel
                    // No alias needed - uses default model name
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        // Filter to only include students who have submitted registration form
        const studentsWithRegistrations = yield Promise.all(students.map((student) => __awaiter(void 0, void 0, void 0, function* () {
            const registration = yield database_1.StudentRegistrationModel.findOne({
                where: { userId: student.id },
                order: [['createdAt', 'DESC']]
            });
            return { student, registration };
        })));
        // Keep ALL students, not just those with registrations
        const allStudents = studentsWithRegistrations.map(item => item.student);
        console.log('Found students:', students.length);
        console.log('Students with registrations:', studentsWithRegistrations.filter(item => item.registration !== null).length);
        // Get registration and enrollment data for ALL students
        const studentsWithDetails = yield Promise.all(allStudents.map((student, index) => __awaiter(void 0, void 0, void 0, function* () {
            const studentDetails = student.get('Student');
            // Use the registration data we already fetched
            const registration = studentsWithRegistrations[index].registration;
            // Get student enrollment count
            const enrollmentCount = yield database_1.StudentEnrollmentModel.count({
                where: { studentId: student.id }
            });
            // Get current year level and semester from registration
            let currentYearLevel = 'Not registered';
            let currentSemester = 'Not registered';
            let totalUnits = 0;
            let registrationStatus = 'Not registered';
            let registrationDate = null;
            if (registration) {
                currentYearLevel = registration.yearLevel;
                currentSemester = registration.semester;
                registrationStatus = registration.registrationStatus;
                registrationDate = new Date(registration.createdAt).toISOString().split('T')[0];
                // Calculate total units from curriculum
                const curriculum = yield database_1.BsitCurriculumModel.findAll({
                    where: {
                        yearLevel: registration.yearLevel,
                        semester: registration.semester,
                        isActive: true
                    }
                });
                totalUnits = curriculum.reduce((sum, course) => sum + course.units, 0);
            }
            // 1. Create a 'name' field in the desired "Last, First M." format.
            const name = `${student.lastName}, ${student.firstName} ${student.middleName || ''}`.trim();
            // 2. Format the 'createdAt' date into a 'YYYY-MM-DD' string to prevent "Invalid Date".
            const formattedDate = new Date(student.createdAt).toISOString().split('T')[0];
            return {
                id: student.id,
                idNumber: student.idNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                middleName: student.middleName,
                gender: (studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.gender) || 'N/A',
                email: student.email,
                phoneNumber: student.phoneNumber,
                profilePhoto: student.profilePhoto, // Add profile photo field
                isRegistered: !!studentDetails,
                course: 'Bachelor of Science in Information Technology', // BSIT is the course
                studentNumber: (studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.studentNumber) || student.idNumber,
                fullName: (studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.fullName) || `${student.firstName} ${student.lastName}`,
                academicStatus: (studentDetails === null || studentDetails === void 0 ? void 0 : studentDetails.academicStatus) || 'Not registered',
                createdAt: formattedDate,
                // New fields for registration and enrollment
                registrationStatus: registrationStatus,
                registrationDate: registrationDate,
                currentYearLevel: currentYearLevel,
                currentSemester: currentSemester,
                totalUnits: totalUnits,
                enrollmentCount: enrollmentCount,
                isFullyEnrolled: enrollmentCount > 0
            };
        })));
        console.log('Fetched students:', studentsWithDetails.length);
        console.log('Sample student data:', studentsWithDetails[0]);
        res.json(studentsWithDetails);
    }
    catch (error) {
        console.error('Error fetching all students:', error);
        next(error);
    }
});
exports.getAllStudentAccounts = getAllStudentAccounts;
// --- START: Add this new function ---
const resetStudentPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield database_1.UserModel.findByPk(id);
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
