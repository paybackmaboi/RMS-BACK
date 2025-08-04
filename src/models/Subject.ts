import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface SubjectAttributes {
    id: number;
    code: string;
    name: string;
    description?: string;
    units: number;
    courseId: number;
    yearLevel: number;
    semester: number;
    subjectType: 'Core' | 'Elective' | 'General Education' | 'NSTP' | 'PE';
    isActive: boolean;
}

interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {}

export class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
    public id!: number;
    public code!: string;
    public name!: string;
    public description!: string;
    public units!: number;
    public courseId!: number;
    public yearLevel!: number;
    public semester!: number;
    public subjectType!: 'Core' | 'Elective' | 'General Education' | 'NSTP' | 'PE';
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSubject = (sequelize: Sequelize) => {
    Subject.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        units: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        yearLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        semester: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subjectType: {
            type: DataTypes.ENUM('Core', 'Elective', 'General Education', 'NSTP', 'PE'),
            allowNull: false,
            defaultValue: 'Core',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'subjects',
        sequelize: sequelize,
    });
};