import { Model, DataTypes, Sequelize } from 'sequelize';

export interface PaymentAttributes {
    id: number;
    requestId: number;
    studentId: string;
    amount: number;
    paymentMethod: 'cash' | 'check' | 'online';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    paidAt?: Date;
    receivedBy?: string; // Accounting staff who received payment
    receiptNumber?: string;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaymentCreationAttributes extends Omit<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public id!: number;
    public requestId!: number;
    public studentId!: string;
    public amount!: number;
    public paymentMethod!: 'cash' | 'check' | 'online';
    public paymentStatus!: 'pending' | 'paid' | 'refunded';
    public paidAt?: Date;
    public receivedBy?: string;
    public receiptNumber?: string;
    public remarks?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initPayment = (sequelize: Sequelize) => {
    Payment.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        requestId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'requests',
                key: 'id'
            }
        },
        studentId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.ENUM('cash', 'check', 'online'),
            allowNull: false,
            defaultValue: 'cash',
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'refunded'),
            allowNull: false,
            defaultValue: 'pending',
        },
        paidAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        receivedBy: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        receiptNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'payments',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'idx_payments_requestId',
                fields: ['requestId']
            },
            {
                name: 'idx_payments_studentId',
                fields: ['studentId']
            },
            {
                name: 'idx_payments_status',
                fields: ['paymentStatus']
            }
        ]
    });
};
