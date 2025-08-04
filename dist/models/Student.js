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
            references: {
                model: 'users',
                key: 'id',
            }
        },
        gender: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
        },
        placeOfBirth: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        civilStatus: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        religion: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        parentGuardian: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        permanentAddress: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        previousSchool: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        yearOfEntry: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        yearOfGraduation: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'students',
        sequelize: sequelize,
    });
};
exports.initStudent = initStudent;
