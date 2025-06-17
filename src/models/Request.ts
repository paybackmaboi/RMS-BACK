import { Model, DataTypes, Sequelize } from 'sequelize';

export class Request extends Model {
    public id!: number;
    public studentId!: number;
    public documentType!: string;
    public purpose!: string;
    // FIX: Added 'ready for pick-up' to the allowed status types
    public status!: 'pending' | 'approved' | 'rejected' | 'ready for pick-up'; 
    public notes?: string;
    public filePath?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initRequest = (sequelize: Sequelize) => {
    Request.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        documentType: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        purpose: {
            type: new DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            // FIX: Added 'ready for pick-up' to the ENUM definition
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'ready for pick-up'),
            defaultValue: 'pending',
            allowNull: false,
        },
        notes: {
            type: new DataTypes.TEXT,
            allowNull: true,
        },
        filePath: {
            type: new DataTypes.STRING(255),
            allowNull: true, 
        },
    }, {
        tableName: 'requests',
        sequelize: sequelize,
    });
};
