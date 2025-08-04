import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface CourseAttributes {
    id: number;
    courseCode: string;
    courseName: string;
    department?: string;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
    public id!: number;
    public courseCode!: string;
    public courseName!: string;
    public department!: string;

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
        courseCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        courseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'courses',
        sequelize: sequelize,
    });
};