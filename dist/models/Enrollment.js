"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEnrollment = exports.Enrollment = void 0;
const sequelize_1 = require("sequelize");
class Enrollment extends sequelize_1.Model {
}
exports.Enrollment = Enrollment;
const initEnrollment = (sequelize) => {
    Enrollment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        scheduleId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('enrolled', 'assessed', 'dropped'),
            defaultValue: 'enrolled',
            allowNull: false,
        },
    }, {
        tableName: 'enrollments',
        sequelize: sequelize,
    });
};
exports.initEnrollment = initEnrollment;
