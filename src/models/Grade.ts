import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface GradeAttributes {
    id: number;
    enrollmentId: number;
    prelims?: number;
    midterms?: number;
    finals?: number;
    finalGrade?: number;
}

interface GradeCreationAttributes extends Optional<GradeAttributes, 'id'> {}

export class Grade extends Model<GradeAttributes, GradeCreationAttributes> implements GradeAttributes {
    public id!: number;
    public enrollmentId!: number;
    public prelims!: number;
    public midterms!: number;
    public finals!: number;
    public finalGrade!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initGrade = (sequelize: Sequelize) => {
    Grade.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        enrollmentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        prelims: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        midterms: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        finals: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        finalGrade: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
    }, {
        tableName: 'grades',
        sequelize: sequelize,
    });
};