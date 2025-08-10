"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGrade = exports.Grade = void 0;
const sequelize_1 = require("sequelize");
class Grade extends sequelize_1.Model {
}
exports.Grade = Grade;
const initGrade = (sequelize) => {
    Grade.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        enrollmentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        prelims: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        midterms: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        finals: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        finalGrade: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
    }, {
        tableName: 'grades',
        sequelize: sequelize,
    });
};
exports.initGrade = initGrade;
