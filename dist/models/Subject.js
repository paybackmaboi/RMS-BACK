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
        subjectCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        units: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'subjects',
        sequelize: sequelize,
    });
};
exports.initSubject = initSubject;
