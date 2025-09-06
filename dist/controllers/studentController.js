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
exports.getStudentBalance = exports.updateApprovedRegistrationsToEnrolled = exports.updateStudentRegistration = exports.searchUserByIdNumber = exports.getCurrentStudentProfile = exports.debugStudentRegistration = exports.registerStudent = exports.deleteStudent = exports.updateStudent = exports.getRegistrationStatus = exports.createAndEnrollStudent = exports.getStudentEnrolledSubjects = exports.getStudentRegistrationData = exports.getStudentDetails = exports.getAllStudents = exports.completeStudentRegistration = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
// Helper function to generate a unique ID Number
const generateIdNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentYear = new Date().getFullYear();
    const lastUser = yield database_1.UserModel.findOne({
        where: { idNumber: { [sequelize_1.Op.like]: `${currentYear}-%` } },
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
// Complete student registration with permanent data (requires session authentication)
const completeStudentRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get userId from the authenticated session
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const registrationData = req.body;
        console.log('📝 Student completing registration for user ID:', userId);
        console.log('📝 Registration data:', registrationData);
        // Check if user exists and is a student
        const user = yield database_1.UserModel.findByPk(userId);
        if (!user || user.role !== 'student') {
            res.status(404).json({ message: 'Student user not found' });
            return;
        }
        // Since StudentModel is not available, we'll work with StudentRegistrationModel only
        console.log('📝 StudentModel not available, using StudentRegistrationModel only');
        // Create student registration record with proper data types
        const studentRegistration = yield database_1.StudentRegistrationModel.create({
            userId: userId,
            studentId: userId.toString(), // Use userId as studentId since StudentModel is not available
            firstName: user.firstName,
            middleName: user.middleName || '',
            lastName: user.lastName,
            dateOfBirth: registrationData.dateOfBirth || '',
            placeOfBirth: registrationData.placeOfBirth || '',
            gender: registrationData.gender || 'N/A',
            maritalStatus: registrationData.maritalStatus || 'Single',
            nationality: registrationData.nationality || 'Filipino',
            religion: registrationData.religion || '',
            email: registrationData.email || user.email || '',
            contactNumber: registrationData.contactNumber || '',
            cityAddress: registrationData.cityAddress || '',
            cityTelNumber: registrationData.cityTelNumber || '',
            provincialAddress: registrationData.provincialAddress || '',
            provincialTelNumber: registrationData.provincialTelNumber || '',
            fatherName: registrationData.fatherName || '',
            fatherAddress: registrationData.fatherAddress || '',
            fatherOccupation: registrationData.fatherOccupation || '',
            fatherCompany: registrationData.fatherCompany || '',
            fatherContactNumber: registrationData.fatherContactNumber || '',
            fatherIncome: registrationData.fatherIncome || '',
            motherName: registrationData.motherName || '',
            motherAddress: registrationData.motherAddress || '',
            motherOccupation: registrationData.motherOccupation || '',
            motherCompany: registrationData.motherCompany || '',
            motherContactNumber: registrationData.motherContactNumber || '',
            motherIncome: registrationData.motherIncome || '',
            guardianName: registrationData.guardianName || '',
            guardianAddress: registrationData.guardianAddress || '',
            guardianOccupation: registrationData.guardianOccupation || '',
            guardianCompany: registrationData.guardianCompany || '',
            guardianContactNumber: registrationData.guardianContactNumber || '',
            guardianIncome: registrationData.guardianIncome || '',
            yearLevel: registrationData.yearLevel || '1st Year',
            semester: registrationData.semester || 'First Semester',
            schoolYear: registrationData.schoolYear || new Date().getFullYear().toString(),
            applicationType: registrationData.applicationType || 'Freshmen',
            studentType: registrationData.studentType || 'First',
            elementarySchool: registrationData.elementarySchool || '',
            elementaryAddress: registrationData.elementaryAddress || '',
            elementaryHonor: registrationData.elementaryHonor || '',
            elementaryYearGraduated: registrationData.elementaryYearGraduated ? parseInt(registrationData.elementaryYearGraduated) || undefined : undefined,
            juniorHighSchool: registrationData.juniorHighSchool || '',
            juniorHighAddress: registrationData.juniorHighAddress || '',
            juniorHighHonor: registrationData.juniorHighHonor || '',
            juniorHighYearGraduated: registrationData.juniorHighYearGraduated ? parseInt(registrationData.juniorHighYearGraduated) || undefined : undefined,
            seniorHighSchool: registrationData.seniorHighSchool || '',
            seniorHighAddress: registrationData.seniorHighAddress || '',
            seniorHighStrand: registrationData.seniorHighStrand || '',
            seniorHighHonor: registrationData.seniorHighHonor || '',
            seniorHighYearGraduated: registrationData.seniorHighYearGraduated ? parseInt(registrationData.seniorHighYearGraduated) || undefined : undefined,
            ncaeGrade: registrationData.ncaeGrade || '',
            specialization: registrationData.specialization || '',
            lastCollegeAttended: registrationData.lastCollegeAttended || '',
            lastCollegeYearTaken: registrationData.lastCollegeYearTaken ? parseInt(registrationData.lastCollegeYearTaken) || undefined : undefined,
            lastCollegeCourse: registrationData.lastCollegeCourse || '',
            lastCollegeMajor: registrationData.lastCollegeMajor || '',
            course: 'Bachelor of Science in Information Technology',
            major: 'Information Technology',
            registrationStatus: 'Approved'
        });
        console.log('✅ Created student registration record:', studentRegistration.id);
        res.status(201).json({
            message: 'Student registration completed successfully',
            studentId: userId,
            registrationId: studentRegistration.id,
            status: 'Enrolled'
        });
    }
    catch (error) {
        console.error('❌ Error completing student registration:', error);
        res.status(500).json({
            message: 'Failed to complete student registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Contact administrator'
        });
    }
});
exports.completeStudentRegistration = completeStudentRegistration;
const getAllStudents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔍 Fetching all students...');
        const students = yield database_1.UserModel.findAll({
            where: { role: 'student', isActive: true },
            order: [['createdAt', 'DESC']]
        });
        console.log(`📊 Found ${students.length} students in users table`);
        // Debug: Check what's in the student_enrollments table
        const allEnrollments = yield database_1.StudentEnrollmentModel.findAll({
            attributes: ['id', 'studentId', 'scheduleId', 'enrollmentStatus'],
            raw: true
        });
        console.log(`🔍 Total enrollments in database: ${allEnrollments.length}`);
        console.log('🔍 Enrollment details:', allEnrollments);
        // Get registration and enrollment data for all students
        const studentsWithDetails = yield Promise.all(students.map((student) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`🔍 Processing student: ${student.firstName} ${student.lastName} (ID: ${student.id})`);
            // Get student registration data
            const registration = yield database_1.StudentRegistrationModel.findOne({
                where: { userId: student.id },
                order: [['createdAt', 'DESC']]
            });
            console.log(`📋 Registration found: ${registration ? 'YES' : 'NO'}`);
            if (registration) {
                console.log(`📝 Registration details: ${registration.yearLevel} ${registration.semester}, Status: ${registration.registrationStatus}`);
            }
            // Get student enrollment count - check if student has any enrollments
            const enrollmentCount = yield database_1.StudentEnrollmentModel.count({
                where: { studentId: student.id } // studentId is INTEGER in StudentEnrollmentModel
            });
            console.log(`📚 Enrollment count for student ${student.id}: ${enrollmentCount}`);
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
                gender: (registration === null || registration === void 0 ? void 0 : registration.gender) || 'N/A',
                email: student.email,
                phoneNumber: student.phoneNumber,
                profilePhoto: student.profilePhoto || null, // Return null if no profile photo
                isRegistered: !!registration,
                course: 'Bachelor of Science in Information Technology', // BSIT is the course
                studentNumber: student.idNumber,
                fullName: `${student.firstName} ${student.lastName}`,
                academicStatus: (registration === null || registration === void 0 ? void 0 : registration.registrationStatus) || 'Not registered',
                createdAt: formattedDate,
                // New fields for registration and enrollment
                registrationStatus: registrationStatus,
                registrationDate: registrationDate,
                currentYearLevel: currentYearLevel,
                currentSemester: currentSemester,
                totalUnits: totalUnits,
                enrollmentCount: enrollmentCount,
                isFullyEnrolled: enrollmentCount > 0 || (registration && registration.registrationStatus === 'Approved')
            };
        })));
        console.log(`✅ Processed ${studentsWithDetails.length} students with details`);
        console.log('📊 Final student data:', studentsWithDetails.map(s => ({
            name: `${s.firstName} ${s.lastName}`,
            yearLevel: s.currentYearLevel,
            semester: s.currentSemester,
            enrollmentCount: s.enrollmentCount,
            isFullyEnrolled: s.isFullyEnrolled
        })));
        res.json(studentsWithDetails);
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
        // First, get the user without includes to avoid association errors
        const student = yield database_1.UserModel.findByPk(id);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }
        // Get student registration data for detailed information
        const studentRegistration = yield database_1.StudentRegistrationModel.findOne({
            where: { userId: id },
            order: [['createdAt', 'DESC']]
        });
        // StudentModel and CourseModel are not available, so we'll work with registration data only
        let studentDetails = null;
        // Combine user and registration data
        const studentData = Object.assign(Object.assign({}, student.toJSON()), { studentDetails: null, registration: studentRegistration ? {
                yearLevel: studentRegistration.yearLevel,
                semester: studentRegistration.semester,
                email: studentRegistration.email,
                contactNumber: studentRegistration.contactNumber,
                gender: studentRegistration.gender,
                dateOfBirth: studentRegistration.dateOfBirth,
                placeOfBirth: studentRegistration.placeOfBirth,
                religion: studentRegistration.religion,
                nationality: studentRegistration.nationality,
                cityAddress: studentRegistration.cityAddress,
                provincialAddress: studentRegistration.provincialAddress,
                fatherName: studentRegistration.fatherName,
                fatherOccupation: studentRegistration.fatherOccupation,
                motherName: studentRegistration.motherName,
                motherOccupation: studentRegistration.motherOccupation,
                guardianName: studentRegistration.guardianName,
                registrationStatus: studentRegistration.registrationStatus,
                registrationDate: studentRegistration.createdAt
            } : null });
        res.json(studentData);
    }
    catch (error) {
        console.error('Error in getStudentDetails:', error);
        next(error);
    }
});
exports.getStudentDetails = getStudentDetails;
// Get student registration data by user ID (admin only)
const getStudentRegistrationData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log('🔍 Fetching registration data for userId:', userId);
        const studentRegistration = yield database_1.StudentRegistrationModel.findOne({
            where: { userId: userId },
            order: [['createdAt', 'DESC']]
        });
        console.log('📋 Found registration data:', studentRegistration ? 'YES' : 'NO');
        if (studentRegistration) {
            console.log('📝 Registration details:', {
                id: studentRegistration.id,
                firstName: studentRegistration.firstName,
                lastName: studentRegistration.lastName,
                gender: studentRegistration.gender,
                email: studentRegistration.email
            });
        }
        if (!studentRegistration) {
            res.status(404).json({ message: 'Student registration not found' });
            return;
        }
        res.json(studentRegistration);
    }
    catch (error) {
        console.error('Error fetching student registration data:', error);
        next(error);
    }
});
exports.getStudentRegistrationData = getStudentRegistrationData;
// Get student enrolled subjects by year level and semester
const getStudentEnrolledSubjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log('🔍 Fetching enrolled subjects for userId:', userId);
        // First get the student's current year level and semester
        const studentRegistration = yield database_1.StudentRegistrationModel.findOne({
            where: { userId: userId },
            order: [['createdAt', 'DESC']]
        });
        if (!studentRegistration) {
            res.status(404).json({ message: 'Student registration not found' });
            return;
        }
        const { yearLevel, semester } = studentRegistration;
        console.log('📚 Student is in:', yearLevel, semester);
        // Get the curriculum for this year level and semester
        const curriculum = yield database_1.BsitCurriculumModel.findAll({
            where: {
                yearLevel: yearLevel,
                semester: semester,
                isActive: true
            },
            order: [['courseCode', 'ASC']]
        });
        // For now, we'll show all curriculum subjects and mark them as enrolled
        // In a real system, you'd need to join enrollments with schedules and curriculum
        const subjects = curriculum.map(course => {
            return {
                id: course.id,
                courseCode: course.courseCode,
                courseTitle: course.courseDescription,
                units: course.units,
                courseType: course.courseType,
                prerequisites: course.prerequisites,
                isEnrolled: true, // For now, assume enrolled
                enrollmentId: null,
                finalGrade: 'N/A',
                status: 'Enrolled',
                yearLevel: course.yearLevel,
                semester: course.semester
            };
        });
        console.log('📋 Found subjects:', subjects.length);
        res.json({
            yearLevel,
            semester,
            totalUnits: subjects.reduce((sum, sub) => sum + sub.units, 0),
            subjects
        });
    }
    catch (error) {
        console.error('Error fetching student enrolled subjects:', error);
        next(error);
    }
});
exports.getStudentEnrolledSubjects = getStudentEnrolledSubjects;
const createAndEnrollStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, middleName, gender, courseId } = req.body;
        const idNumber = yield generateIdNumber();
        const password = generatePassword();
        const newUser = yield database_1.UserModel.create({
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
        // Check registration status using StudentRegistrationModel instead of StudentModel
        const registration = yield database_1.StudentRegistrationModel.findOne({ where: { userId } });
        res.json({ isRegistered: !!registration });
    }
    catch (error) {
        next(error);
    }
});
exports.getRegistrationStatus = getRegistrationStatus;
const updateStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = yield database_1.UserModel.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'Student user account not found.' });
            return;
        }
        // Update user data
        yield user.update({
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            middleName: updateData.middleName,
            email: updateData.email,
        });
        // Update student registration data instead of student details
        const studentRegistration = yield database_1.StudentRegistrationModel.findOne({ where: { userId: id } });
        if (studentRegistration) {
            yield studentRegistration.update({
                gender: updateData.gender,
                contactNumber: updateData.contactNumber,
                cityAddress: updateData.cityAddress,
                provincialAddress: updateData.provincialAddress,
                // Add other fields as needed
            });
        }
        res.json({ message: 'Student updated successfully.' });
    }
    catch (error) {
        console.error("Error updating student:", error);
        next(error);
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield database_1.UserModel.findByPk(id);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }
        // Soft delete by setting isActive to false
        yield student.update({ isActive: false });
        // Also soft delete student registration if it exists
        const studentRegistration = yield database_1.StudentRegistrationModel.findOne({ where: { userId: id } });
        if (studentRegistration) {
            yield studentRegistration.update({ registrationStatus: 'Rejected' });
        }
        res.json({ message: 'Student deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteStudent = deleteStudent;
const registerStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idNumber, password, firstName, lastName, middleName } = req.body;
        // Validate required fields
        if (!idNumber || !password || !firstName || !lastName) {
            res.status(400).json({ message: 'School ID, Password, First Name, and Last Name are required.' });
            return;
        }
        // Check if user already exists
        const existingUser = yield database_1.UserModel.findOne({ where: { idNumber } });
        if (existingUser) {
            res.status(409).json({ message: `The School ID '${idNumber}' is already registered. Please use a different School ID.` });
            return;
        }
        // Create user account
        const newUser = yield database_1.UserModel.create({
            idNumber,
            password,
            role: 'student',
            firstName,
            lastName,
            middleName: middleName || '',
            isActive: true
        });
        res.status(201).json({
            message: 'Student registration completed successfully! You can now login with your School ID and password.',
            studentId: idNumber,
            firstName,
            lastName,
            redirectTo: '/student-homepage'
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
        const user = yield database_1.UserModel.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if student registration exists
        const registration = yield database_1.StudentRegistrationModel.findOne({ where: { userId } });
        res.json({
            user: {
                id: user.id,
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            registration: registration ? {
                id: registration.id,
                yearLevel: registration.yearLevel,
                semester: registration.semester,
                course: registration.course,
                registrationStatus: registration.registrationStatus
            } : null,
            isRegistered: !!registration
        });
    }
    catch (error) {
        console.error('Error in debug endpoint:', error);
        next(error);
    }
});
exports.debugStudentRegistration = debugStudentRegistration;
const getCurrentStudentProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        // Get user and student data
        const user = yield database_1.UserModel.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const registration = yield database_1.StudentRegistrationModel.findOne({ where: { userId } });
        if (!registration) {
            res.status(404).json({ message: 'Student registration not found' });
            return;
        }
        const responseData = {
            id: user.id,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePhoto: user.profilePhoto || null, // Return null if no profile photo (frontend will handle default)
            fullName: `${user.firstName} ${user.lastName} ${user.middleName || ''}`.trim(),
            studentNumber: user.idNumber,
            currentYearLevel: registration.yearLevel,
            currentSemester: registration.semester,
            totalUnitsEarned: 0, // Not available without StudentModel
            cumulativeGPA: 0.0, // Not available without StudentModel
            academicStatus: registration.registrationStatus,
            yearOfEntry: new Date().getFullYear(),
            applicationType: registration.applicationType,
            studentType: registration.studentType
        };
        res.json(responseData);
    }
    catch (error) {
        console.error('Student profile controller error:', error);
        next(error);
    }
});
exports.getCurrentStudentProfile = getCurrentStudentProfile;
const searchUserByIdNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idNumber } = req.params;
        console.log('🔍 Searching for user with ID number:', idNumber);
        const user = yield database_1.UserModel.findOne({
            where: { idNumber },
            attributes: ['id', 'idNumber', 'firstName', 'lastName', 'middleName', 'email', 'phoneNumber', 'role']
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('❌ Error searching for user:', error);
        next(error);
    }
});
exports.searchUserByIdNumber = searchUserByIdNumber;
const updateStudentRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        console.log('🔍 Updating student registration for userId:', userId);
        console.log('🔍 Update data received:', updateData);
        // Find the user
        const user = yield database_1.UserModel.findByPk(parseInt(userId, 10));
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Find the student registration record
        const studentRegistration = yield database_1.StudentRegistrationModel.findOne({
            where: { userId: parseInt(userId, 10) },
            order: [['createdAt', 'DESC']]
        });
        if (!studentRegistration) {
            res.status(404).json({ message: 'Student registration not found' });
            return;
        }
        // Update the student registration data
        yield studentRegistration.update(updateData);
        console.log('✅ Student registration updated successfully');
        // Also update the user data if basic fields are provided
        const userUpdateData = {
            firstName: updateData.firstName || user.firstName,
            lastName: updateData.lastName || user.lastName,
            middleName: updateData.middleName || user.middleName,
            email: updateData.email || user.email,
            phoneNumber: updateData.contactNumber || user.phoneNumber
        };
        yield user.update(userUpdateData);
        console.log('✅ User data updated successfully');
        res.json({ message: 'Student registration updated successfully.' });
    }
    catch (error) {
        console.error('❌ Error updating student registration:', error);
        next(error);
    }
});
exports.updateStudentRegistration = updateStudentRegistration;
// Update all approved registrations to "Enrolled" status
const updateApprovedRegistrationsToEnrolled = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔄 Checking current registration statuses...');
        // Get all registrations with their current status
        const allRegistrations = yield database_1.StudentRegistrationModel.findAll({
            order: [['createdAt', 'DESC']]
        });
        console.log(`📋 Found ${allRegistrations.length} total registrations`);
        // Show current status distribution
        const statusCounts = allRegistrations.reduce((acc, reg) => {
            acc[reg.registrationStatus] = (acc[reg.registrationStatus] || 0) + 1;
            return acc;
        }, {});
        console.log('📊 Current status distribution:', statusCounts);
        // Find registrations that should be considered "enrolled" (have student records)
        const enrolledRegistrations = [];
        for (const registration of allRegistrations) {
            // Since StudentModel is not available, we'll consider all registrations as enrolled
            if (registration.registrationStatus === 'Pending') {
                // Update to "Approved" since they're registered
                yield registration.update({ registrationStatus: 'Approved' });
                enrolledRegistrations.push(registration);
                console.log(`✅ Updated ${registration.firstName} ${registration.lastName} to "Approved" (enrolled)`);
            }
        }
        console.log(`✅ Successfully updated ${enrolledRegistrations.length} registrations to "Approved" status`);
        res.json({
            message: `Updated ${enrolledRegistrations.length} registrations to "Approved" status`,
            note: 'Note: Database uses "Approved" status for enrolled students. Frontend can display this as "Enrolled".',
            updatedCount: enrolledRegistrations.length,
            currentStatusDistribution: statusCounts,
            updatedRegistrations: enrolledRegistrations.map(r => ({
                id: r.id,
                firstName: r.firstName,
                lastName: r.lastName,
                registrationStatus: r.registrationStatus
            }))
        });
    }
    catch (error) {
        console.error('❌ Error updating registrations:', error);
        next(error);
    }
});
exports.updateApprovedRegistrationsToEnrolled = updateApprovedRegistrationsToEnrolled;
// Get student balance
const getStudentBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        // For now, return a default balance of 0
        // In a real system, this would query a billing/balance table
        res.json({
            tuitionBalance: 0,
            message: 'Balance retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error getting student balance:', error);
        next(error);
    }
});
exports.getStudentBalance = getStudentBalance;
