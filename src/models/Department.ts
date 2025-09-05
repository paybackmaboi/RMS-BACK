import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface DepartmentAttributes {
    id: number;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
}

interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, 'id'> {}

export class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
    public id!: number;
    public code!: string;
    public name!: string;
    public description!: string;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initDepartment = (sequelize: Sequelize) => {
    Department.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(10),
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
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'departments',
        sequelize: sequelize,
        indexes: [
            {
                unique: true,
                fields: ['code']
            }
        ]
    });
}; 