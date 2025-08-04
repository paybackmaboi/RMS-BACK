import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface ScheduleAttributes {
    id: number;
    subjectId: number;
    schoolYearId: number;
    semesterId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room?: string;
    maxStudents?: number;
    currentEnrolled: number;
    isActive: boolean;
}

interface ScheduleCreationAttributes extends Optional<ScheduleAttributes, 'id'> {}

export class Schedule extends Model<ScheduleAttributes, ScheduleCreationAttributes> implements ScheduleAttributes {
    public id!: number;
    public subjectId!: number;
    public schoolYearId!: number;
    public semesterId!: number;
    public dayOfWeek!: string;
    public startTime!: string;
    public endTime!: string;
    public room!: string;
    public maxStudents!: number;
    public currentEnrolled!: number;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initSchedule = (sequelize: Sequelize) => {
    Schedule.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        subjectId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        schoolYearId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        semesterId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        dayOfWeek: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        startTime: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        endTime: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        room: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        maxStudents: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 50,
        },
        currentEnrolled: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'schedules',
        sequelize: sequelize,
    });
};