import { Model, DataTypes, Sequelize } from 'sequelize';

export interface ActivityLogAttributes {
    id: number;
    userId: number;
    action: string;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: string; // JSON string for additional data
    createdAt: Date;
}

export interface ActivityLogCreationAttributes extends Omit<ActivityLogAttributes, 'id' | 'createdAt'> {}

export class ActivityLog extends Model<ActivityLogAttributes, ActivityLogCreationAttributes> implements ActivityLogAttributes {
    public id!: number;
    public userId!: number;
    public action!: string;
    public description?: string;
    public ipAddress?: string;
    public userAgent?: string;
    public metadata?: string;
    public readonly createdAt!: Date;
}

export const initActivityLog = (sequelize: Sequelize): typeof ActivityLog => {
    ActivityLog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'ID of the user who performed the action'
            },
            action: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: 'Type of action performed (login, logout, view_profile, etc.)'
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'Detailed description of the action'
            },
            ipAddress: {
                type: DataTypes.STRING(45),
                allowNull: true,
                comment: 'IP address of the user'
            },
            userAgent: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'User agent string from browser'
            },
            metadata: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'Additional data in JSON format'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'ActivityLog',
            tableName: 'activity_logs',
            timestamps: false, // Only createdAt, no updatedAt
            indexes: [
                {
                    fields: ['userId']
                },
                {
                    fields: ['action']
                },
                {
                    fields: ['createdAt']
                },
                {
                    fields: ['userId', 'createdAt']
                }
            ]
        }
    );

    return ActivityLog;
};
