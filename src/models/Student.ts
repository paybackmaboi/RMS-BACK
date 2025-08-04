import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { User } from './User';

interface StudentAttributes {
    id: number;
    userId: number;
    gender?: string;
    dateOfBirth?: Date;
    placeOfBirth?: string;
    civilStatus?: string;
    religion?: string;
    parentGuardian?: string;
    permanentAddress?: string;
    previousSchool?: string;
    yearOfEntry?: number;
    yearOfGraduation?: number;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
    public id!: number;
    public userId!: number;
    public gender!: string;
    public dateOfBirth!: Date;
    public placeOfBirth!: string;
    public civilStatus!: string;
    public religion!: string;
    public parentGuardian!: string;
    public permanentAddress!: string;
    public previousSchool!: string;
    public yearOfEntry!: number;
    public yearOfGraduation!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initStudent = (sequelize: Sequelize) => {
    Student.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            }
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        placeOfBirth: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        civilStatus: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        religion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        parentGuardian: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        permanentAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        previousSchool: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        yearOfEntry: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        yearOfGraduation: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'students',
        sequelize: sequelize,
    });
};