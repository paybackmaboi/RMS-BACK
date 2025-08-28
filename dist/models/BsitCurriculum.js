"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBsitCurriculum = exports.BsitCurriculum = void 0;
const sequelize_1 = require("sequelize");
class BsitCurriculum extends sequelize_1.Model {
}
exports.BsitCurriculum = BsitCurriculum;
const initBsitCurriculum = (sequelize) => {
    BsitCurriculum.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        courseCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        courseDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        units: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        yearLevel: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        semester: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        courseType: {
            type: sequelize_1.DataTypes.ENUM('Lecture', 'Laboratory', 'Both'),
            allowNull: false,
        },
        prerequisites: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
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
        tableName: 'bsit_curriculum',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'unique_course_year_sem',
                unique: true,
                fields: ['courseCode', 'yearLevel', 'semester']
            },
            {
                name: 'idx_bsit_curriculum_yearLevel',
                fields: ['yearLevel']
            },
            {
                name: 'idx_bsit_curriculum_semester',
                fields: ['semester']
            },
            {
                name: 'idx_bsit_curriculum_courseCode',
                fields: ['courseCode']
            }
        ]
    });
};
exports.initBsitCurriculum = initBsitCurriculum;
