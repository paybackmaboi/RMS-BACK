import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

// Define the attributes interface
export interface DocumentAttributes {
  id: number;
  studentId: number;
  requirementType: string; // 'psa', 'validId', 'form137', 'idPicture'
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: number; // admin user ID who reviewed
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the creation attributes interface (optional fields for creation)
export interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id' | 'reviewedAt' | 'reviewedBy' | 'remarks' | 'createdAt' | 'updatedAt'> {}

// Define the Document model class
export class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: number;
  public studentId!: number;
  public requirementType!: string;
  public fileName!: string;
  public originalName!: string;
  public filePath!: string;
  public fileSize!: number;
  public mimeType!: string;
  public status!: 'pending' | 'approved' | 'rejected';
  public uploadedAt!: Date;
  public reviewedAt?: Date;
  public reviewedBy?: number;
  public remarks?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Document model
export const initDocument = () => {
  Document.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      requirementType: {
        type: DataTypes.ENUM('psa', 'validId', 'form137', 'idPicture'),
        allowNull: false,
        comment: 'Type of requirement document',
      },
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Generated file name for storage',
      },
      originalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Original file name uploaded by user',
      },
      filePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Full path to the stored file',
      },
      fileSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'File size in bytes',
      },
      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'MIME type of the file',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Document review status',
      },
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'When the document was uploaded',
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When the document was reviewed',
      },
      reviewedBy: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Admin user who reviewed the document',
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Admin remarks about the document',
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
      tableName: 'documents',
      timestamps: true,
      indexes: [
        {
          fields: ['studentId'],
        },
        {
          fields: ['requirementType'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['studentId', 'requirementType'],
          unique: true,
          name: 'unique_student_requirement',
        },
      ],
    }
  );
};

export default Document;
