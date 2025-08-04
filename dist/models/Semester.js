"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSemester = exports.Semester = void 0;
const sequelize_1 = require("sequelize");
class Semester extends sequelize_1.Model {
}
exports.Semester = Semester;
const initSemester = (sequelize) => {
    Semester.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        code: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'semesters',
        sequelize: sequelize,
    });
};
exports.initSemester = initSemester;
