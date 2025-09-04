import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface SchoolYearAttributes {
    id: number;
    year: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    isCurrent: boolean;
    isActive: boolean;
}

interface SchoolYearCreationAttributes extends Optional<SchoolYearAttributes, 'id'> {}

export class SchoolYear extends Model<SchoolYearAttributes, SchoolYearCreationAttributes> implements SchoolYearAttributes {
    public id!: number;
    public year!: string;
    public description!: string;
    public startDate!: Date;
    public endDate!: Date;
    public isCurrent!: boolean;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSchoolYear = (sequelize: Sequelize) => {
    SchoolYear.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        year: {
            type: DataTypes.STRING(20),
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
        isCurrent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'school_years',
        sequelize: sequelize,
    });
}; 