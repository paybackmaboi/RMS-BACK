"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStudent = exports.Student = void 0;
const sequelize_1 = require("sequelize");
class Student extends sequelize_1.Model {
}
exports.Student = Student;
const initStudent = (sequelize) => {
    Student.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            // Removed unique constraint to allow multiple student records per user if needed
        },
        courseId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true, // Allow null initially for existing records
        },
        studentNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        // I. PERSONAL DATA
        fullName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        gender: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true, // Will be filled later
        },
        maritalStatus: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true, // Will be filled later
        },
        placeOfBirth: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        email: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        contactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        religion: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true, // Will be filled later
        },
        citizenship: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true, // Will be filled later
            defaultValue: 'Filipino',
        },
        country: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true, // Will be filled later
            defaultValue: 'Philippines',
        },
        acrNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // Address Information
        cityAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        cityTelNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        provincialAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        provincialTelNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        // II. FAMILY BACKGROUND
        // Father's Information
        fatherName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        fatherAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        fatherOccupation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        fatherCompany: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        fatherContactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        fatherIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // Mother's Information
        motherName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        motherAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true, // Will be filled later
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
            allowNull: true, // Will be filled later
        },
        motherIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // Guardian's Information
        guardianName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        guardianAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        guardianOccupation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        guardianCompany: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        guardianContactNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true, // Will be filled later
        },
        guardianIncome: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        // III. CURRENT ACADEMIC BACKGROUND
        major: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        studentType: {
            type: sequelize_1.DataTypes.ENUM('First', 'Second', 'Summer'),
            allowNull: false,
            defaultValue: 'First',
        },
        semesterEntry: {
            type: sequelize_1.DataTypes.ENUM('First', 'Second', 'Summer'),
            allowNull: false,
            defaultValue: 'First',
        },
        yearOfEntry: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        estimatedYearOfGraduation: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        applicationType: {
            type: sequelize_1.DataTypes.ENUM('Freshmen', 'Transferee', 'Cross Enrollee'),
            allowNull: false,
            defaultValue: 'Freshmen',
        },
        // IV. ACADEMIC HISTORY
        // Elementary
        elementarySchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        elementaryAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        elementaryHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        elementaryYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true, // Will be filled later
        },
        // Junior High School
        juniorHighSchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        juniorHighAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        juniorHighHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        juniorHighYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true, // Will be filled later
        },
        // Senior High School
        seniorHighSchool: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true, // Will be filled later
        },
        seniorHighAddress: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true, // Will be filled later
        },
        seniorHighStrand: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighHonor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        seniorHighYearGraduated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true, // Will be filled later
        },
        // Additional Academic Information
        ncaeGrade: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        specialization: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
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
        // Academic Status
        academicStatus: {
            type: sequelize_1.DataTypes.ENUM('Regular', 'Irregular', 'Probationary', 'Graduated', 'Dropped'),
            allowNull: false,
            defaultValue: 'Regular',
        },
        currentYearLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        currentSemester: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        totalUnitsEarned: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        cumulativeGPA: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'students',
        sequelize: sequelize,
    });
};
exports.initStudent = initStudent;
exports.default = exports.initStudent;
