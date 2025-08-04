# 🗄️ **Database Normalization & ERD Documentation**

## **📊 Entity Relationship Diagram (ERD)**

### **🏛️ Core Academic Structure**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Department    │    │     Course      │    │     Subject     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ PK: id          │───▶│ PK: id          │───▶│ PK: id          │
│ code            │    │ code            │    │ code            │
│ name            │    │ name            │    │ name            │
│ description     │    │ departmentId    │    │ description     │
│ isActive        │    │ totalUnits      │    │ units           │
└─────────────────┘    │ duration        │    │ courseId        │
                       │ level           │    │ yearLevel       │
                       │ isActive        │    │ semester        │
                       └─────────────────┘    │ subjectType     │
                                              │ isActive        │
                                              └─────────────────┘
```

### **📚 Academic Period Management**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SchoolYear    │    │    Semester     │    │    Schedule     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ PK: id          │    │ PK: id          │    │ PK: id          │
│ year            │    │ name            │    │ subjectId       │
│ description     │    │ code            │    │ schoolYearId    │
│ startDate       │    │ description     │    │ semesterId      │
│ endDate         │    │ startDate       │    │ teacherId       │
│ isCurrent       │    │ endDate         │    │ dayOfWeek       │
│ isActive        │    │ isActive        │    │ startTime       │
└─────────────────┘    └─────────────────┘    │ endTime         │
                                              │ room            │
                                              │ maxStudents     │
                                              │ currentEnrolled │
                                              │ isActive        │
                                              └─────────────────┘
```

### **👥 User & Student Management**

```
┌─────────────────┐    ┌─────────────────┐
│      User       │    │     Student     │
├─────────────────┤    ├─────────────────┤
│ PK: id          │───▶│ PK: id          │
│ idNumber        │    │ userId          │
│ password        │    │ courseId        │
│ role            │    │ studentNumber   │
│ firstName       │    │ gender          │
│ lastName        │    │ dateOfBirth     │
│ middleName      │    │ placeOfBirth    │
│ email           │    │ civilStatus     │
│ phoneNumber     │    │ religion        │
│ isActive        │    │ nationality     │
└─────────────────┘    │ parentGuardian  │
                       │ parentContact   │
                       │ permanentAddress│
                       │ presentAddress  │
                       │ previousSchool  │
                       │ yearOfEntry     │
                       │ yearOfGraduation│
                       │ academicStatus  │
                       │ currentYearLevel│
                       │ currentSemester │
                       │ totalUnitsEarned│
                       │ cumulativeGPA   │
                       │ isActive        │
                       └─────────────────┘
```

### **📝 Academic Records**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Schedule     │    │   Enrollment    │    │      Grade      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ PK: id          │───▶│ PK: id          │───▶│ PK: id          │
│ subjectId       │    │ studentId       │    │ enrollmentId    │
│ schoolYearId    │    │ scheduleId      │    │ midtermGrade    │
│ semesterId      │    │ enrollmentDate  │    │ finalGrade      │
│ teacherId       │    │ status          │    │ remarks         │
│ dayOfWeek       │    │ isActive        │    │ isActive        │
│ startTime       │    └─────────────────┘    └─────────────────┘
│ endTime         │
│ room            │
│ maxStudents     │
│ currentEnrolled │
│ isActive        │
└─────────────────┘
```

### **📋 Administrative Records**

```
┌─────────────────┐    ┌─────────────────┐
│      User       │    │     Request     │
├─────────────────┤    ├─────────────────┤
│ PK: id          │───▶│ PK: id          │
│ idNumber        │    │ studentId       │
│ password        │    │ documentType    │
│ role            │    │ purpose         │
│ firstName       │    │ status          │
│ lastName        │    │ notes           │
│ middleName      │    │ filePath        │
│ email           │    │ isActive        │
│ phoneNumber     │    └─────────────────┘
│ isActive        │
└─────────────────┘
```

## **🔗 Relationship Definitions**

### **1. Department → Course (1:N)**
- One department can have multiple courses
- Each course belongs to exactly one department

### **2. Course → Subject (1:N)**
- One course can have multiple subjects
- Each subject belongs to exactly one course

### **3. User → Student (1:1)**
- One user can have one student record
- Each student record belongs to exactly one user

### **4. Course → Student (1:N)**
- One course can have multiple students
- Each student belongs to exactly one course

### **5. SchoolYear → Schedule (1:N)**
- One school year can have multiple schedules
- Each schedule belongs to exactly one school year

### **6. Semester → Schedule (1:N)**
- One semester can have multiple schedules
- Each schedule belongs to exactly one semester

### **7. Subject → Schedule (1:N)**
- One subject can have multiple schedules
- Each schedule belongs to exactly one subject

### **8. User (Teacher) → Schedule (1:N)**
- One teacher can teach multiple schedules
- Each schedule can have one teacher (optional)

### **9. Student → Enrollment (1:N)**
- One student can have multiple enrollments
- Each enrollment belongs to exactly one student

### **10. Schedule → Enrollment (1:N)**
- One schedule can have multiple enrollments
- Each enrollment belongs to exactly one schedule

### **11. Enrollment → Grade (1:1)**
- One enrollment can have one grade
- Each grade belongs to exactly one enrollment

### **12. User → Request (1:N)**
- One user can have multiple requests
- Each request belongs to exactly one user

### **13. User → Notification (1:N)**
- One user can have multiple notifications
- Each notification belongs to exactly one user

## **🔒 Security & Data Integrity**

### **Primary Keys**
- All tables use auto-incrementing integer primary keys
- Unique constraints on business keys (idNumber, studentNumber, etc.)

### **Foreign Keys**
- All relationships are properly enforced with foreign key constraints
- Cascade rules ensure data integrity

### **Indexes**
- Primary keys are automatically indexed
- Foreign keys should be indexed for performance
- Business keys (idNumber, studentNumber) are indexed

### **Data Validation**
- ENUM types for status fields
- CHECK constraints for valid ranges
- NOT NULL constraints where appropriate

## **📊 Normalization Level: 3NF**

### **First Normal Form (1NF)**
- ✅ All attributes are atomic
- ✅ No repeating groups
- ✅ Primary keys defined

### **Second Normal Form (2NF)**
- ✅ All non-key attributes depend on the entire primary key
- ✅ No partial dependencies

### **Third Normal Form (3NF)**
- ✅ No transitive dependencies
- ✅ All attributes depend only on the primary key

## **🚀 Benefits of This Design**

### **1. Scalability**
- Supports large student populations
- Efficient querying with proper indexing
- Easy to add new departments/courses

### **2. Data Integrity**
- Referential integrity enforced
- No data anomalies
- Consistent data across tables

### **3. Flexibility**
- Easy to modify academic structures
- Support for different course types
- Extensible for future requirements

### **4. Performance**
- Optimized for common queries
- Proper indexing strategy
- Efficient joins

### **5. Maintainability**
- Clear separation of concerns
- Easy to understand relationships
- Modular design

## **📋 Sample Data Population**

### **Departments**
```sql
INSERT INTO departments (code, name, description) VALUES
('CIT', 'College of Information Technology', 'Computer and IT programs'),
('CBE', 'College of Business and Economics', 'Business and economics programs'),
('CAS', 'College of Arts and Sciences', 'Liberal arts and sciences programs');
```

### **Courses**
```sql
INSERT INTO courses (code, name, departmentId, totalUnits, duration, level) VALUES
('BSIT', 'Bachelor of Science in Information Technology', 1, 144, 4, 'Undergraduate'),
('BSCS', 'Bachelor of Science in Computer Science', 1, 144, 4, 'Undergraduate'),
('BSBA', 'Bachelor of Science in Business Administration', 2, 144, 4, 'Undergraduate');
```

### **School Years**
```sql
INSERT INTO school_years (year, description, startDate, endDate, isCurrent) VALUES
('2024-2025', 'Academic Year 2024-2025', '2024-06-01', '2025-05-31', true),
('2023-2024', 'Academic Year 2023-2024', '2023-06-01', '2024-05-31', false);
```

### **Semesters**
```sql
INSERT INTO semesters (name, code, startDate, endDate) VALUES
('First Semester', '1ST', '2024-06-01', '2024-10-31'),
('Second Semester', '2ND', '2024-11-01', '2025-03-31'),
('Summer', 'SUM', '2025-04-01', '2025-05-31');
```

This normalized database structure provides a solid foundation for managing actual student data with proper department and level organization! 🎓 