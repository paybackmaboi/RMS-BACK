import { Model, DataTypes, Sequelize } from 'sequelize';

export interface RequirementsAttributes {
    id: number;
    studentId: number;
    requirementType: 'psa' | 'validId' | 'form137' | 'idPicture';
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    isSubmitted: boolean;
    submittedAt?: Date;
    verifiedBy?: number; // admin user ID who verified
    verifiedAt?: Date;
    status: 'pending' | 'submitted' | 'verified' | 'rejected';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequirementsCreationAttributes extends Omit<RequirementsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Requirements extends Model<RequirementsAttributes, RequirementsCreationAttributes> implements RequirementsAttributes {
    public id!: number;
    public studentId!: number;
    public requirementType!: 'psa' | 'validId' | 'form137' | 'idPicture';
    public fileName!: string;
    public filePath!: string;
    public fileSize!: number;
    public mimeType!: string;
    public isSubmitted!: boolean;
    public submittedAt?: Date;
    public verifiedBy?: number;
    public verifiedAt?: Date;
    public status!: 'pending' | 'submitted' | 'verified' | 'rejected';
    public notes?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

export const initRequirements = (sequelize: Sequelize): void => {
    Requirements.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            studentId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            requirementType: {
                type: DataTypes.ENUM('psa', 'validId', 'form137', 'idPicture'),
                allowNull: false
            },
            fileName: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            filePath: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
            fileSize: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            mimeType: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            isSubmitted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            submittedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            verifiedBy: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            verifiedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('pending', 'submitted', 'verified', 'rejected'),
                allowNull: false,
                defaultValue: 'pending'
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            tableName: 'requirements',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['studentId', 'requirementType']
                },
                {
                    fields: ['studentId']
                },
                {
                    fields: ['status']
                }
            ]
        }
    );
};
