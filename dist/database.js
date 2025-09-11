"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.LoginHistoryModel = exports.AccountingModel = exports.NotificationModel = exports.RequestModel = exports.UserSessionModel = exports.StudentEnrollmentModel = exports.SchedulesModel = exports.SubjectsModel = exports.StudentRegistrationModel = exports.EnrollmentModel = exports.SemesterModel = exports.SchoolYearModel = exports.CourseModel = exports.DepartmentModel = exports.StudentModel = exports.UserModel = exports.connectAndInitialize = exports.defineAssociations = exports.initializeModels = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const mysql2_1 = __importDefault(require("mysql2"));
// Import all model initializers
const User_1 = require("./models/User");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return User_1.User; } });
const Student_1 = require("./models/Student");
Object.defineProperty(exports, "StudentModel", { enumerable: true, get: function () { return Student_1.Student; } });
const Department_1 = require("./models/Department");
Object.defineProperty(exports, "DepartmentModel", { enumerable: true, get: function () { return Department_1.Department; } });
const Course_1 = require("./models/Course");
Object.defineProperty(exports, "CourseModel", { enumerable: true, get: function () { return Course_1.Course; } });
const SchoolYear_1 = require("./models/SchoolYear");
Object.defineProperty(exports, "SchoolYearModel", { enumerable: true, get: function () { return SchoolYear_1.SchoolYear; } });
const Semester_1 = require("./models/Semester");
Object.defineProperty(exports, "SemesterModel", { enumerable: true, get: function () { return Semester_1.Semester; } });
const Enrollment_1 = require("./models/Enrollment");
Object.defineProperty(exports, "EnrollmentModel", { enumerable: true, get: function () { return Enrollment_1.Enrollment; } });
const StudentRegistration_1 = require("./models/StudentRegistration");
Object.defineProperty(exports, "StudentRegistrationModel", { enumerable: true, get: function () { return StudentRegistration_1.StudentRegistration; } });
const Subjects_1 = require("./models/Subjects");
Object.defineProperty(exports, "SubjectsModel", { enumerable: true, get: function () { return Subjects_1.Subjects; } });
const Schedules_1 = require("./models/Schedules");
Object.defineProperty(exports, "SchedulesModel", { enumerable: true, get: function () { return Schedules_1.Schedules; } });
const StudentEnrollment_1 = require("./models/StudentEnrollment");
Object.defineProperty(exports, "StudentEnrollmentModel", { enumerable: true, get: function () { return StudentEnrollment_1.StudentEnrollment; } });
const UserSession_1 = require("./models/UserSession");
Object.defineProperty(exports, "UserSessionModel", { enumerable: true, get: function () { return UserSession_1.UserSession; } });
const Request_1 = require("./models/Request");
Object.defineProperty(exports, "RequestModel", { enumerable: true, get: function () { return Request_1.Request; } });
const Notification_1 = require("./models/Notification");
Object.defineProperty(exports, "NotificationModel", { enumerable: true, get: function () { return Notification_1.Notification; } });
const LoginHistory_1 = require("./models/LoginHistory");
Object.defineProperty(exports, "LoginHistoryModel", { enumerable: true, get: function () { return LoginHistory_1.LoginHistory; } });
const Accounting_1 = require("./models/Accounting");
Object.defineProperty(exports, "AccountingModel", { enumerable: true, get: function () { return Accounting_1.Accounting; } });
// Load environment variables
dotenv_1.default.config();
// check if we are in production
const isProduction = process.env.NODE_ENV === 'production';
// Database configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME;
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
// Create Sequelize instance
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'mysql',
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    dialectModule: mysql2_1.default,
    dialectOptions: {
        // MySQL2 configuration
        supportBigNumbers: true,
        bigNumberStrings: true,
        dateStrings: true,
        decimalNumbers: true,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000
    },
    logging: console.log, // Enable logging for debugging
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
// Initialize all models
const initializeModels = () => {
    (0, User_1.initUser)(exports.sequelize);
    (0, Student_1.initStudent)(exports.sequelize);
    (0, Department_1.initDepartment)(exports.sequelize);
    (0, Course_1.initCourse)(exports.sequelize);
    (0, SchoolYear_1.initSchoolYear)(exports.sequelize);
    (0, Semester_1.initSemester)(exports.sequelize);
    (0, Enrollment_1.initEnrollment)(exports.sequelize);
    (0, StudentRegistration_1.initStudentRegistration)(exports.sequelize);
    (0, Subjects_1.initSubjects)(exports.sequelize);
    (0, Schedules_1.initSchedules)(exports.sequelize);
    (0, StudentEnrollment_1.initStudentEnrollment)(exports.sequelize);
    (0, UserSession_1.initUserSession)(exports.sequelize);
    (0, Request_1.initRequest)(exports.sequelize);
    (0, Notification_1.initNotification)(exports.sequelize);
    (0, Accounting_1.initAccounting)(exports.sequelize);
    (0, LoginHistory_1.initLoginHistory)(exports.sequelize);
};
exports.initializeModels = initializeModels;
// Define associations
const defineAssociations = () => {
    // User associations
    User_1.User.hasOne(Student_1.Student, { foreignKey: 'userId' });
    Student_1.Student.belongsTo(User_1.User, { foreignKey: 'userId' });
    // A User (who is a student) has one Accounting record
    User_1.User.hasOne(Accounting_1.Accounting, { foreignKey: 'studentId', as: 'accounting' });
    Accounting_1.Accounting.belongsTo(User_1.User, { foreignKey: 'studentId', as: 'user' });
    // Department associations
    Department_1.Department.hasMany(Course_1.Course, { foreignKey: 'departmentId' });
    Course_1.Course.belongsTo(Department_1.Department, { foreignKey: 'departmentId' });
    // Course associations
    Course_1.Course.hasMany(Student_1.Student, { foreignKey: 'courseId' });
    Student_1.Student.belongsTo(Course_1.Course, { foreignKey: 'courseId' });
    // Schedule associations
    Schedules_1.Schedules.belongsTo(Subjects_1.Subjects, { foreignKey: 'subjectId' });
    Subjects_1.Subjects.hasMany(Schedules_1.Schedules, { foreignKey: 'subjectId' });
    // Enrollment associations
    Enrollment_1.Enrollment.belongsTo(Student_1.Student, { foreignKey: 'studentId' });
    Student_1.Student.hasMany(Enrollment_1.Enrollment, { foreignKey: 'studentId' });
    Enrollment_1.Enrollment.belongsTo(Schedules_1.Schedules, { foreignKey: 'scheduleId' });
    Schedules_1.Schedules.hasMany(Enrollment_1.Enrollment, { foreignKey: 'scheduleId' });
    // Student Registration associations
    StudentRegistration_1.StudentRegistration.belongsTo(User_1.User, { foreignKey: 'userId' });
    User_1.User.hasMany(StudentRegistration_1.StudentRegistration, { foreignKey: 'userId' });
    // Subjects associations
    Subjects_1.Subjects.hasMany(Schedules_1.Schedules, { foreignKey: 'subjectId' });
    Schedules_1.Schedules.belongsTo(Subjects_1.Subjects, { foreignKey: 'subjectId' });
    // Student Enrollment associations
    StudentEnrollment_1.StudentEnrollment.belongsTo(Student_1.Student, { foreignKey: 'studentId' });
    Student_1.Student.hasMany(StudentEnrollment_1.StudentEnrollment, { foreignKey: 'studentId' });
    StudentEnrollment_1.StudentEnrollment.belongsTo(Schedules_1.Schedules, { foreignKey: 'scheduleId' });
    Schedules_1.Schedules.hasMany(StudentEnrollment_1.StudentEnrollment, { foreignKey: 'scheduleId' });
    // Request associations
    Request_1.Request.belongsTo(User_1.User, { foreignKey: 'studentId', as: 'student' });
    User_1.User.hasMany(Request_1.Request, { foreignKey: 'studentId', as: 'requests' });
    // Notification associations
    Notification_1.Notification.belongsTo(User_1.User, { foreignKey: 'userId' });
    User_1.User.hasMany(Notification_1.Notification, { foreignKey: 'userId' });
    Notification_1.Notification.belongsTo(Request_1.Request, { foreignKey: 'requestId' });
    Request_1.Request.hasMany(Notification_1.Notification, { foreignKey: 'requestId' });
    // Login History associations
    LoginHistory_1.LoginHistory.belongsTo(User_1.User, { foreignKey: 'userId' });
    User_1.User.hasMany(LoginHistory_1.LoginHistory, { foreignKey: 'userId' });
};
exports.defineAssociations = defineAssociations;
// Connect to database and initialize
const connectAndInitialize = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔌 Attempting to connect to database...');
        console.log(`📍 Host: ${DB_HOST}:${DB_PORT}`);
        console.log(`👤 User: ${DB_USER}`);
        console.log(`🗄️  Database: ${DB_NAME}`);
        // Validate required environment variables
        if (!DB_NAME) {
            throw new Error('DB_NAME environment variable is required. Please check your .env file.');
        }
        // Create database if it doesn't exist
        const mysql = require('mysql2/promise');
        const connection = yield mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT
        });
        yield connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        yield connection.end();
        console.log(`✅ Database '${DB_NAME}' ensured to exist.`);
        // Test connection
        yield exports.sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        // Initialize models
        (0, exports.initializeModels)();
        console.log('✅ Models initialized successfully.');
        // Define associations
        (0, exports.defineAssociations)();
        console.log('✅ Model associations defined successfully.');
        // Database sync with minimal changes to avoid key limit issues
        yield exports.sequelize.sync({ alter: false }); // Don't alter existing tables to avoid key conflicts
        console.log('✅ Database tables created/synced successfully.');
        const { seedInitialData } = yield Promise.resolve().then(() => __importStar(require('./seedData')));
        yield seedInitialData();
        // Create sample admin user if it doesn't exist
        const adminUser = yield User_1.User.findOne({
            where: { idNumber: 'A001' }
        });
        if (!adminUser) {
            const bcrypt = require('bcrypt');
            const hashedPassword = yield bcrypt.hash('adminpass', 10);
            yield User_1.User.create({
                idNumber: 'A001',
                password: hashedPassword,
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@benedicto.edu.ph',
                isActive: true
            });
            console.log('✅ Sample admin user created (A001/adminpass)');
        }
        // Create sample accounting user if it doesn't exist
        const accountingUser = yield User_1.User.findOne({
            where: { idNumber: 'ACC01' }
        });
        if (!accountingUser) {
            const bcrypt = require('bcrypt');
            const hashedPassword = yield bcrypt.hash('accpass', 10);
            yield User_1.User.create({
                idNumber: 'ACC01',
                password: hashedPassword,
                role: 'accounting',
                firstName: 'Accounting',
                lastName: 'User',
                email: 'accounting@benedicto.edu.ph',
                isActive: true
            });
            console.log('✅ Sample accounting user created (ACC01/accpass)');
        }
        // Create sample student user if it doesn't exist
        const studentUser = yield User_1.User.findOne({
            where: { idNumber: '2022-00037' }
        });
        if (!studentUser) {
            const bcrypt = require('bcrypt');
            const hashedPassword = yield bcrypt.hash('password', 10);
            const newUser = yield User_1.User.create({
                idNumber: '2022-00037',
                password: hashedPassword,
                role: 'student',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@student.benedicto.edu.ph',
                isActive: true
            });
            // Create student record
            yield Student_1.Student.create({
                userId: newUser.id,
                studentNumber: '2022-00037',
                fullName: 'Doe, John',
                yearOfEntry: new Date().getFullYear(),
                studentType: 'First',
                semesterEntry: 'First',
                applicationType: 'Freshmen',
                academicStatus: 'Regular',
                currentYearLevel: 1,
                currentSemester: 1,
                totalUnitsEarned: 0,
                cumulativeGPA: 0.00,
                isActive: true
            });
            console.log('✅ Sample student user created (2022-00037/password)');
        }
        console.log('🎉 Database initialization completed successfully!');
    }
    catch (error) {
        console.error('❌ Database initialization failed:');
        if (error instanceof Error) {
            console.error(`   Error: ${error.message}`);
            if (error.message.includes('ECONNREFUSED')) {
                console.error('   💡 Make sure MySQL server is running and accessible');
                console.error('   💡 Check if the host and port are correct');
            }
            else if (error.message.includes('Access denied')) {
                console.error('   💡 Check your username and password');
            }
            else if (error.message.includes('Unknown database')) {
                console.error('   💡 Make sure the database exists');
            }
        }
        else {
            console.error('   Unknown error:', error);
        }
        throw error;
    }
});
exports.connectAndInitialize = connectAndInitialize;
