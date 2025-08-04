"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCourse = exports.Course = void 0;
const sequelize_1 = require("sequelize");
class Course extends sequelize_1.Model {
}
exports.Course = Course;
const initCourse = (sequelize) => {
    Course.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        departmentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        totalUnits: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 4,
        },
        level: {
            type: sequelize_1.DataTypes.ENUM('Undergraduate', 'Graduate', 'Postgraduate'),
            allowNull: false,
            defaultValue: 'Undergraduate',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'courses',
        sequelize: sequelize,
    });
};
exports.initCourse = initCourse;
