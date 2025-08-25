import { Model, DataTypes, Sequelize } from 'sequelize';

export interface BsitScheduleAttributes {
    id: number;
    curriculumId: number;
    schoolYear: string;
    semester: string;
    yearLevel: string;
    
    // Schedule Details
    day: string;
    startTime: Date;
    endTime: Date;
    room: string;
    instructor?: string;
    maxStudents: number;
    currentEnrollment: number;
    
    // Schedule Status
    scheduleStatus: 'Open' | 'Closed' | 'Cancelled';
    remarks?: string;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface BsitScheduleCreationAttributes extends Omit<BsitScheduleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class BsitSchedule extends Model<BsitScheduleAttributes, BsitScheduleCreationAttributes> implements BsitScheduleAttributes {
    public id!: number;
    public curriculumId!: number;
    public schoolYear!: string;
    public semester!: string;
    public yearLevel!: string;
    
    // Schedule Details
    public day!: string;
    public startTime!: Date;
    public endTime!: Date;
    public room!: string;
    public instructor?: string;
    public maxStudents!: number;
    public currentEnrollment!: number;
    
    // Schedule Status
    public scheduleStatus!: 'Open' | 'Closed' | 'Cancelled';
    public remarks?: string;
    
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initBsitSchedule = (sequelize: Sequelize) => {
    BsitSchedule.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        curriculumId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'bsit_curriculum',
                key: 'id'
            }
        },
        schoolYear: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        semester: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        yearLevel: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        
        // Schedule Details
        day: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        room: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        instructor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        maxStudents: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 40,
        },
        currentEnrollment: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        
        // Schedule Status
        scheduleStatus: {
            type: DataTypes.ENUM('Open', 'Closed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Open',
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        
        // Timestamps
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
        tableName: 'bsit_schedules',
        sequelize: sequelize,
        timestamps: true,
        indexes: [
            {
                name: 'idx_schedule_lookup',
                fields: ['schoolYear', 'semester', 'yearLevel', 'day']
            },
            {
                name: 'idx_bsit_schedules_yearLevel',
                fields: ['yearLevel']
            },
            {
                name: 'idx_bsit_schedules_semester',
                fields: ['semester']
            },
            {
                name: 'idx_bsit_schedules_schoolYear',
                fields: ['schoolYear']
            },
            {
                name: 'idx_bsit_schedules_day',
                fields: ['day']
            }
        ]
    });
};
