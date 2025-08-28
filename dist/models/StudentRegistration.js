"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStudentRegistration = exports.StudentRegistration = void 0;
const sequelize_1 = require("sequelize");
class StudentRegistration extends sequelize_1.Model {
}
exports.StudentRegistration = StudentRegistration;
const initStudentRegistration = (sequelize) => {
    StudentRegistration.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        studentId: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        // Basic Information
        firstName: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        middleName: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        placeOfBirth: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        gender: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true,
        },
        maritalStatus: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        nationality: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Filipino',
        },
        religion: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // Contact Information
        email: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        contactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        cityAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        cityTelNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        provincialAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        provincialTelNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        // Family Background
        fatherName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        fatherAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        fatherOccupation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        fatherCompany: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        fatherContactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        fatherIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        motherName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        motherAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        motherOccupation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        motherCompany: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        motherContactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        motherIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        guardianName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        guardianAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        guardianOccupation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        guardianCompany: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        guardianContactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        guardianIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // Academic Information
        yearLevel: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        semester: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        schoolYear: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        applicationType: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'Freshmen',
        },
        studentType: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'First',
        },
        // Academic Background
        elementarySchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        elementaryAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        elementaryHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        elementaryYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        juniorHighSchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        juniorHighAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        juniorHighHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        juniorHighYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        seniorHighSchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        seniorHighStrand: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        seniorHighHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        ncaeGrade: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        specialization: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        // College Background (if applicable)
        lastCollegeAttended: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        lastCollegeYearTaken: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        lastCollegeCourse: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        lastCollegeMajor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        // Course Information
        course: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'Bachelor of Science in Information Technology',
        },
        major: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'Information Technology',
        },
        // Registration Status
        registrationStatus: {
            type: sequelize_1.DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        remarks: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        // Timestamps
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        tableName: 'student_registrations',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'idx_student_registrations_userId',
                fields: ['userId']
            },
            {
                name: 'idx_student_registrations_yearLevel',
                fields: ['yearLevel']
            },
            {
                name: 'idx_student_registrations_semester',
                fields: ['semester']
            },
            {
                name: 'idx_student_registrations_schoolYear',
                fields: ['schoolYear']
            }
        ]
    });
};
exports.initStudentRegistration = initStudentRegistration;
