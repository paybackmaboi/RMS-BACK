// models/Accounting.ts

import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// Define the attributes for the Accounting model
interface AccountingAttributes {
    id: number;
    studentId: number; // Foreign key linking to the User model's ID
    balance: number;
}

// Some attributes are optional in `Accounting.create`
interface AccountingCreationAttributes extends Optional<AccountingAttributes, 'id'> {}

export class Accounting extends Model<AccountingAttributes, AccountingCreationAttributes> implements AccountingAttributes {
    public id!: number;
    public studentId!: number;
    public balance!: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialize the model for Sequelize
export const initAccounting = (sequelize: Sequelize) => {
    Accounting.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true, // Each student should have only one accounting record
            references: {
                model: 'users', // This links to the 'users' table
                key: 'id',
            },
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
    }, {
        tableName: 'accountings',
        sequelize: sequelize,
    });
};

export default initAccounting;