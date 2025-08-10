"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSubject = exports.Subject = void 0;
const sequelize_1 = require("sequelize");
class Subject extends sequelize_1.Model {
}
exports.Subject = Subject;
const initSubject = (sequelize) => {
    Subject.init({
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
        units: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        courseId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        yearLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        semester: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        subjectType: {
            type: sequelize_1.DataTypes.ENUM('Core', 'Elective', 'General Education', 'NSTP', 'PE'),
            allowNull: false,
            defaultValue: 'Core',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'subjects',
        sequelize: sequelize,
    });
};
exports.initSubject = initSubject;
