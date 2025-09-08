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
exports.EnrollmentModel = exports.ScheduleModel = exports.SemesterModel = exports.SchoolYearModel = exports.SubjectModel = exports.CourseModel = exports.DepartmentModel = exports.StudentModel = exports.ActivityLogModel = exports.SettingsModel = exports.PaymentModel = exports.RequestModel = exports.NotificationModel = exports.RequirementsModel = exports.UserSessionModel = exports.StudentEnrollmentModel = exports.BsitScheduleModel = exports.BsitCurriculumModel = exports.StudentRegistrationModel = exports.UserModel = exports.connectAndInitialize = exports.defineAssociations = exports.initializeModels = exports.sequelize = void 0;
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
const Subject_1 = require("./models/Subject");
Object.defineProperty(exports, "SubjectModel", { enumerable: true, get: function () { return Subject_1.Subject; } });
const SchoolYear_1 = require("./models/SchoolYear");
Object.defineProperty(exports, "SchoolYearModel", { enumerable: true, get: function () { return SchoolYear_1.SchoolYear; } });
const Semester_1 = require("./models/Semester");
Object.defineProperty(exports, "SemesterModel", { enumerable: true, get: function () { return Semester_1.Semester; } });
const Schedule_1 = require("./models/Schedule");
Object.defineProperty(exports, "ScheduleModel", { enumerable: true, get: function () { return Schedule_1.Schedule; } });
const Enrollment_1 = require("./models/Enrollment");
Object.defineProperty(exports, "EnrollmentModel", { enumerable: true, get: function () { return Enrollment_1.Enrollment; } });
const StudentRegistration_1 = require("./models/StudentRegistration");
Object.defineProperty(exports, "StudentRegistrationModel", { enumerable: true, get: function () { return StudentRegistration_1.StudentRegistration; } });
const BsitCurriculum_1 = require("./models/BsitCurriculum");
Object.defineProperty(exports, "BsitCurriculumModel", { enumerable: true, get: function () { return BsitCurriculum_1.BsitCurriculum; } });
const BsitSchedule_1 = require("./models/BsitSchedule");
Object.defineProperty(exports, "BsitScheduleModel", { enumerable: true, get: function () { return BsitSchedule_1.BsitSchedule; } });
const StudentEnrollment_1 = require("./models/StudentEnrollment");
Object.defineProperty(exports, "StudentEnrollmentModel", { enumerable: true, get: function () { return StudentEnrollment_1.StudentEnrollment; } });
const UserSession_1 = require("./models/UserSession");
Object.defineProperty(exports, "UserSessionModel", { enumerable: true, get: function () { return UserSession_1.UserSession; } });
const Request_1 = require("./models/Request");
Object.defineProperty(exports, "RequestModel", { enumerable: true, get: function () { return Request_1.Request; } });
const Notification_1 = require("./models/Notification");
Object.defineProperty(exports, "NotificationModel", { enumerable: true, get: function () { return Notification_1.Notification; } });
const Requirements_1 = require("./models/Requirements");
Object.defineProperty(exports, "RequirementsModel", { enumerable: true, get: function () { return Requirements_1.Requirements; } });
const Payment_1 = require("./models/Payment");
Object.defineProperty(exports, "PaymentModel", { enumerable: true, get: function () { return Payment_1.Payment; } });
const Settings_1 = require("./models/Settings");
Object.defineProperty(exports, "SettingsModel", { enumerable: true, get: function () { return Settings_1.Settings; } });
const ActivityLog_1 = require("./models/ActivityLog");
Object.defineProperty(exports, "ActivityLogModel", { enumerable: true, get: function () { return ActivityLog_1.ActivityLog; } });
// Load environment variables
dotenv_1.default.config();
// Check if we're in production
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
    },
    logging: isProduction ? false : console.log, // Disable logging in production
    pool: {
        max: isProduction ? 10 : 5,
        min: isProduction ? 2 : 0,
        idle: 10000
    }
});
// Initialize all models
const initializeModels = () => {
    console.log('🔄 Initializing models...');
    // Initialize core models first
    (0, User_1.initUser)(exports.sequelize);
    console.log('✅ User model initialized');
    (0, StudentRegistration_1.initStudentRegistration)(exports.sequelize);
    console.log('✅ StudentRegistration model initialized');
    (0, UserSession_1.initUserSession)(exports.sequelize);
    console.log('✅ UserSession model initialized');
    (0, Request_1.initRequest)(exports.sequelize);
    console.log('✅ Request model initialized');
    (0, Notification_1.initNotification)(exports.sequelize);
    console.log('✅ Notification model initialized');
    // Initialize curriculum models
    (0, BsitCurriculum_1.initBsitCurriculum)(exports.sequelize);
    console.log('✅ BsitCurriculum model initialized');
    (0, BsitSchedule_1.initBsitSchedule)(exports.sequelize);
    console.log('✅ BsitSchedule model initialized');
    (0, StudentEnrollment_1.initStudentEnrollment)(exports.sequelize);
    console.log('✅ StudentEnrollment model initialized');
    (0, Requirements_1.initRequirements)(exports.sequelize);
    console.log('✅ Requirements model initialized');
    (0, Payment_1.initPayment)(exports.sequelize);
    console.log('✅ Payment model initialized');
    (0, Settings_1.initSettings)(exports.sequelize);
    console.log('✅ Settings model initialized');
    (0, ActivityLog_1.initActivityLog)(exports.sequelize);
    console.log('✅ ActivityLog model initialized');
    // Initialize additional models needed by controllers
    (0, Student_1.initStudent)(exports.sequelize);
    console.log('✅ Student model initialized');
    (0, Department_1.initDepartment)(exports.sequelize);
    console.log('✅ Department model initialized');
    (0, Course_1.initCourse)(exports.sequelize);
    console.log('✅ Course model initialized');
    (0, Subject_1.initSubject)(exports.sequelize);
    console.log('✅ Subject model initialized');
    (0, SchoolYear_1.initSchoolYear)(exports.sequelize);
    console.log('✅ SchoolYear model initialized');
    (0, Semester_1.initSemester)(exports.sequelize);
    console.log('✅ Semester model initialized');
    (0, Schedule_1.initSchedule)(exports.sequelize);
    console.log('✅ Schedule model initialized');
    (0, Enrollment_1.initEnrollment)(exports.sequelize);
    console.log('✅ Enrollment model initialized');
    console.log('✅ All models initialized successfully');
};
exports.initializeModels = initializeModels;
/**
 * Define model associations for the database
 * This function sets up relationships between different models
 */
const defineAssociations = () => {
    try {
        // Check if all required models are defined
        if (!User_1.User) {
            console.error('❌ UserModel is undefined');
            throw new Error('UserModel is undefined');
        }
        if (!StudentRegistration_1.StudentRegistration) {
            console.error('❌ StudentRegistrationModel is undefined');
            throw new Error('StudentRegistrationModel is undefined');
        }
        if (!Request_1.Request) {
            console.error('❌ RequestModel is undefined');
            throw new Error('RequestModel is undefined');
        }
        if (!Notification_1.Notification) {
            console.error('❌ NotificationModel is undefined');
            throw new Error('NotificationModel is undefined');
        }
        if (!BsitCurriculum_1.BsitCurriculum) {
            console.error('❌ BsitCurriculumModel is undefined');
            throw new Error('BsitCurriculumModel is undefined');
        }
        if (!BsitSchedule_1.BsitSchedule) {
            console.error('❌ BsitScheduleModel is undefined');
            throw new Error('BsitScheduleModel is undefined');
        }
        if (!StudentEnrollment_1.StudentEnrollment) {
            console.error('❌ StudentEnrollmentModel is undefined');
            throw new Error('StudentEnrollmentModel is undefined');
        }
        if (!Payment_1.Payment) {
            console.error('❌ PaymentModel is undefined');
            throw new Error('PaymentModel is undefined');
        }
        console.log('✅ All required models are defined');
        // ==============================================
        // USER ASSOCIATIONS
        // ==============================================
        // User -> Student Registration (One-to-Many)
        User_1.User.hasMany(StudentRegistration_1.StudentRegistration, {
            foreignKey: 'userId',
            as: 'registrations'
        });
        StudentRegistration_1.StudentRegistration.belongsTo(User_1.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        // User -> Requests (One-to-Many)
        User_1.User.hasMany(Request_1.Request, {
            foreignKey: 'studentId',
            as: 'requests'
        });
        Request_1.Request.belongsTo(User_1.User, {
            foreignKey: 'studentId',
            as: 'student'
        });
        // User -> Notifications (One-to-Many)
        User_1.User.hasMany(Notification_1.Notification, {
            foreignKey: 'userId',
            as: 'notifications'
        });
        Notification_1.Notification.belongsTo(User_1.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        // ==============================================
        // CURRICULUM ASSOCIATIONS
        // ==============================================
        // BSIT Curriculum -> BSIT Schedules (One-to-Many)
        BsitCurriculum_1.BsitCurriculum.hasMany(BsitSchedule_1.BsitSchedule, {
            foreignKey: 'curriculumId',
            as: 'schedules'
        });
        BsitSchedule_1.BsitSchedule.belongsTo(BsitCurriculum_1.BsitCurriculum, {
            foreignKey: 'curriculumId',
            as: 'curriculum'
        });
        // ==============================================
        // ENROLLMENT ASSOCIATIONS
        // ==============================================
        // BSIT Schedule -> Student Enrollments (One-to-Many)
        BsitSchedule_1.BsitSchedule.hasMany(StudentEnrollment_1.StudentEnrollment, {
            foreignKey: 'scheduleId',
            as: 'enrollments'
        });
        StudentEnrollment_1.StudentEnrollment.belongsTo(BsitSchedule_1.BsitSchedule, {
            foreignKey: 'scheduleId',
            as: 'schedule'
        });
        // ==============================================
        // REQUEST & NOTIFICATION ASSOCIATIONS
        // ==============================================
        // Request -> Notifications (One-to-Many, Optional)
        Request_1.Request.hasMany(Notification_1.Notification, {
            foreignKey: 'requestId',
            as: 'notifications'
        });
        Notification_1.Notification.belongsTo(Request_1.Request, {
            foreignKey: 'requestId',
            as: 'request'
        });
        // ==============================================
        // PAYMENT ASSOCIATIONS
        // ==============================================
        // Request -> Payment (One-to-One)
        Request_1.Request.hasOne(Payment_1.Payment, {
            foreignKey: 'requestId',
            as: 'payment'
        });
        Payment_1.Payment.belongsTo(Request_1.Request, {
            foreignKey: 'requestId',
            as: 'request'
        });
        // ==============================================
        // ACTIVITY LOG ASSOCIATIONS
        // ==============================================
        // User -> Activity Logs (One-to-Many)
        User_1.User.hasMany(ActivityLog_1.ActivityLog, {
            foreignKey: 'userId',
            as: 'activityLogs'
        });
        ActivityLog_1.ActivityLog.belongsTo(User_1.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        console.log('✅ Model associations defined successfully.');
    }
    catch (error) {
        console.error('❌ Error defining model associations:', error);
        throw error;
    }
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
        // Small delay to ensure all models are properly loaded
        yield new Promise(resolve => setTimeout(resolve, 200));
        // Re-check models after delay
        console.log('🔍 Checking models after initialization...');
        console.log('UserModel:', !!User_1.User);
        console.log('StudentRegistrationModel:', !!StudentRegistration_1.StudentRegistration);
        console.log('RequestModel:', !!Request_1.Request);
        console.log('NotificationModel:', !!Notification_1.Notification);
        console.log('BsitCurriculumModel:', !!BsitCurriculum_1.BsitCurriculum);
        console.log('BsitScheduleModel:', !!BsitSchedule_1.BsitSchedule);
        console.log('StudentEnrollmentModel:', !!StudentEnrollment_1.StudentEnrollment);
        // Define associations
        (0, exports.defineAssociations)();
        console.log('✅ Model associations defined successfully.');
        // Database sync - ensure all tables exist with correct structure
        try {
            yield exports.sequelize.sync({ alter: true }); // This will create missing tables and alter existing ones
            console.log('✅ Database tables created/synced successfully.');
        }
        catch (syncError) {
            console.warn('⚠️ Database sync had issues, but continuing...');
            console.warn('Sync error:', syncError instanceof Error ? syncError.message : String(syncError));
            // Continue anyway - the server can still work with existing tables
        }
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
            yield User_1.User.create({
                idNumber: '2022-00037',
                password: hashedPassword,
                role: 'student',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@student.benedicto.edu.ph',
                isActive: true
            });
            // Temporarily skip student record creation since StudentModel is commented out
            // await StudentModel.create({
            //     userId: newUser.id,
            //     studentNumber: '2022-00037',
            //     fullName: 'Doe, John',
            //     yearOfEntry: new Date().getFullYear(),
            //     studentType: 'First',
            //     semesterEntry: 'First',
            //     applicationType: 'Freshmen',
            //     academicStatus: 'Regular',
            //     currentYearLevel: 1,
            //     currentSemester: 1,
            //     totalUnitsEarned: 0,
            //     cumulativeGPA: 0.00,
            //     isActive: true
            // });
            console.log('✅ Sample student user created (2022-00037/password) - Student record creation skipped');
        }
        // Initialize default settings
        const { initializeDefaultSettings } = yield Promise.resolve().then(() => __importStar(require('./controllers/settingsController')));
        yield initializeDefaultSettings();
        console.log('✅ Default settings initialized');
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
