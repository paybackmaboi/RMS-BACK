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
        courseCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        courseName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        department: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'courses',
        sequelize: sequelize,
    });
};
exports.initCourse = initCourse;
