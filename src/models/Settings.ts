import { Model, DataTypes, Sequelize } from 'sequelize';

export interface SettingsAttributes {
    id: number;
    key: string;
    value: string;
    description?: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SettingsCreationAttributes extends Omit<SettingsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Settings extends Model<SettingsAttributes, SettingsCreationAttributes> implements SettingsAttributes {
    public id!: number;
    public key!: string;
    public value!: string;
    public description?: string;
    public category!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSettings = (sequelize: Sequelize): typeof Settings => {
    Settings.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            key: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                comment: 'Unique identifier for the setting'
            },
            value: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: 'The setting value'
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'Description of what this setting does'
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: 'general',
                comment: 'Category to group settings'
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
        },
        {
            sequelize,
            modelName: 'Settings',
            tableName: 'settings',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['key']
                },
                {
                    fields: ['category']
                }
            ]
        }
    );

    return Settings;
};
