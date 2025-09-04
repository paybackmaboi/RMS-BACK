import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface SemesterAttributes {
    id: number;
    name: string;
    code: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

interface SemesterCreationAttributes extends Optional<SemesterAttributes, 'id'> {}

export class Semester extends Model<SemesterAttributes, SemesterCreationAttributes> implements SemesterAttributes {
    public id!: number;
    public name!: string;
    public code!: string;
    public description!: string;
    public startDate!: Date;
    public endDate!: Date;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSemester = (sequelize: Sequelize) => {
    Semester.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'semesters',
        sequelize: sequelize,
    });
}; 