import { Model, DataTypes, Sequelize } from 'sequelize';

export class Request extends Model {
    public id!: number;
    public studentId!: number;
    public documentType!: string;
    public purpose!: string;
    public status!: 'pending' | 'payment_required' | 'payment_pending' | 'payment_approved' | 'approved' | 'rejected' | 'ready for pick-up'; 
    public notes?: string;
    // FIX: Changed to store multiple file paths
    public filePath?: string[];
    public amount?: number;
    public requestedBy?: string; // Registrar who requested the document
    public requestedAt?: Date;
    public approvedBy?: string; // Registrar who approved the request
    public approvedAt?: Date;
    public printedAt?: Date;

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
            type: DataTypes.ENUM('pending', 'payment_required', 'payment_pending', 'payment_approved', 'approved', 'rejected', 'ready for pick-up'),
            defaultValue: 'pending',
            allowNull: false,
        },
        notes: {
            type: new DataTypes.TEXT,
            allowNull: true,
        },
        filePath: {
            // FIX: Changed to JSON type to store an array of strings
            type: DataTypes.JSON,
            allowNull: true, 
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        requestedBy: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        requestedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        approvedBy: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        printedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'requests',
        sequelize: sequelize,
    });
};