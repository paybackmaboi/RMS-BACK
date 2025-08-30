import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface CourseAttributes {
    id: number;
    code: string;
    name: string;
    description?: string;
    departmentId: number;
    totalUnits: number;
    duration: number; // in years
    level: 'Undergraduate' | 'Graduate' | 'Postgraduate';
    isActive: boolean;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
    public id!: number;
    public code!: string;
    public name!: string;
    public description!: string;
    public departmentId!: number;
    public totalUnits!: number;
    public duration!: number;
    public level!: 'Undergraduate' | 'Graduate' | 'Postgraduate';
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initCourse = (sequelize: Sequelize) => {
    Course.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        departmentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        totalUnits: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 4,
        },
        level: {
            type: DataTypes.ENUM('Undergraduate', 'Graduate', 'Postgraduate'),
            allowNull: false,
            defaultValue: 'Undergraduate',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'courses',
        sequelize: sequelize,
    });
};