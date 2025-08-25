# 🎓 BSIT Curriculum & Student Registration System

## ✨ **Overview**

This system provides a comprehensive solution for managing BSIT (Bachelor of Science in Information Technology) student registrations and curriculum schedules. Students can now complete their permanent data registration and automatically get enrolled in their year-level schedules.

## 🏗️ **System Architecture**

### **Frontend Components**
- **Student Homepage**: Professional dashboard with tabs for Dashboard and Registration Form
- **Registration Form**: Multi-step form for complete student data submission
- **Professional UI**: Clean, modern design with step-by-step progression

### **Backend Components**
- **Student Registration Controller**: Handles complete registration data
- **BSIT Curriculum Models**: Manages course offerings by year level
- **Schedule Management**: Automatic schedule assignment and enrollment
- **Database Integration**: Sequelize models with automatic table creation

## 📊 **Database Tables**

### **1. student_registrations**
Stores complete student registration data including:
- Basic Information (name, birth details, gender, etc.)
- Contact Information (email, phone, addresses)
- Family Background (parents, guardians)
- Academic Background (elementary to senior high)
- Course Information (BSIT, year level, semester)

### **2. bsit_curriculum**
Contains all BSIT course offerings:
- Course codes and descriptions
- Units per course
- Year level and semester mapping
- Course types (Lecture/Laboratory)

### **3. bsit_schedules**
Manages class schedules:
- Day, time, and room assignments
- Instructor assignments
- Enrollment capacity and current count
- Schedule status (Open/Closed/Cancelled)

### **4. student_enrollments**
Tracks student enrollment in specific schedules:
- Student-schedule relationships
- Enrollment status and grades
- Enrollment dates

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### **Installation**

1. **Clone and Setup**
```bash
cd REGISTRAR-BACK
npm install
```

2. **Environment Configuration**
Create a `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=registrar_db
DB_PORT=3306
```

3. **Start the System**
```bash
# Start backend server
npm run dev

# The system will automatically:
# - Connect to MySQL
# - Create all necessary tables
# - Seed BSIT curriculum data
# - Create sample users
```

## 📚 **BSIT Curriculum Structure**

### **1st Year, 1st Semester**
- **FIL 1 - A**: Wikang Filipino (3 units)
- **IT110**: Introduction to Computing (3 units: 2L + 1Lab)
- **IT111**: Computer Programming 1 (3 units: 2L + 1Lab)
- **IT 112**: PC Assembly & Troubleshooting (3 units: 2L + 1Lab)
- **MATHWORLD-B**: Mathematics in the Modern World (3 units)
- **NSTP1 - C**: National Service Training Program 1 (3 units)
- **PATHFIT 1 - C**: Movement Competency Training (2 units)
- **UTS - A**: Understanding the Self (3 units)
- **MATHPREP**: Pre Calculus for Non-STEM (3 units)

### **2nd Year, 1st Semester**
- **ARTAPP - B**: Art Appreciation (3 units)
- **CW - B**: The Contemporary World (3 units)
- **IT210**: Data Structures & Algorithms (3 units: 2L + 1Lab)
- **IT 211**: Platform Technologies (3 units: 2L + 1Lab)
- **IT 212**: Web Systems & Technologies 1 (3 units: 2L + 1Lab)
- **IT 213**: Introduction to Human Computer Interaction (3 units: 2L + 1Lab)
- **PATHFIT 3-B**: Sports (2 units)
- **STAT**: Statistics & Probability (3 units)

### **3rd Year, 1st Semester**
- **IT310**: Applications Development & Emerging Technologies (3 units: 2L + 1Lab)
- **IT311**: Operating Systems (3 units: 2L + 1Lab)
- **IT312**: Human Computer Interaction (3 units: 2L + 1Lab)
- **ITELEC1**: IT Elective I (3 units: 2L + 1Lab)
- **ITTEL2**: IT Track Elective II (3 units: 2L + 1Lab)
- **STAT**: Statistics & Probability (3 units)
- **TECHNO**: Technopreneurship (3 units: 2L + 1Lab)

### **4th Year, 1st Semester**
- **IT410**: Capstone Project II (3 units: 2L + 1Lab)
- **IT411**: Integrative Programming & Technologies (3 units: 2L + 1Lab)
- **IT 412**: Systems Administration & Maintenance (3 units: 2L + 1Lab)
- **ITELEC3**: IT Elective III (3 units: 2L + 1Lab)
- **RIZAL**: Rizal's Life & Works (3 units)

## 🔄 **Student Registration Flow**

### **Step 1: Basic Information**
- First Name, Middle Name, Last Name
- Date of Birth, Place of Birth
- Gender, Marital Status, Nationality, Religion

### **Step 2: Contact & Family**
- Email, Contact Number
- City and Provincial Addresses
- Father's and Mother's Information
- Guardian Information

### **Step 3: Academic Background**
- Elementary School Details
- Junior High School Details
- Senior High School Details
- NCAE Grade and Specialization

### **Step 4: Review & Submit**
- Year Level Selection (1st, 2nd, 3rd, 4th)
- Semester Selection (1st, 2nd, Summer)
- Final Review and Submission

## 🎯 **Automatic Enrollment Process**

When a student completes registration:

1. **Curriculum Lookup**: System finds BSIT courses for selected year level/semester
2. **Schedule Assignment**: Automatically assigns student to all available schedules
3. **Enrollment Creation**: Creates enrollment records for each course
4. **Capacity Management**: Updates enrollment counts for each schedule

## 📱 **API Endpoints**

### **Student Registration**
```http
POST /api/students/complete-registration
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "yearLevel": "1st",
  "semester": "1st",
  "schoolYear": "2025-2026",
  // ... other registration fields
}
```

### **Response Format**
```json
{
  "message": "Student registration completed successfully!",
  "registration": {
    "id": 1,
    "yearLevel": "1st",
    "semester": "1st",
    "schoolYear": "2025-2026",
    "totalCourses": 12,
    "totalUnits": 36,
    "totalSchedules": 12,
    "totalEnrollments": 12
  },
  "schedule": {
    "yearLevel": "1st",
    "semester": "1st",
    "schoolYear": "2025-2026",
    "courses": [...],
    "schedules": [...]
  }
}
```

## 🎨 **Frontend Features**

### **Professional Design**
- **Clean Interface**: Modern, corporate aesthetic
- **Step Navigation**: Visual progress indicator
- **Responsive Layout**: Mobile-friendly design
- **Form Validation**: Client-side and server-side validation

### **User Experience**
- **Multi-step Forms**: Organized information collection
- **Progress Tracking**: Clear indication of completion status
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation of successful registration

## 🔧 **Technical Implementation**

### **Database Models**
- **Sequelize ORM**: Type-safe database operations
- **Automatic Sync**: Tables created automatically on startup
- **Relationship Management**: Proper foreign key associations
- **Indexing**: Performance optimization for queries

### **Backend Architecture**
- **Express.js**: RESTful API endpoints
- **TypeScript**: Type-safe development
- **Transaction Management**: Data consistency guarantees
- **Error Handling**: Comprehensive error management

### **Frontend Architecture**
- **React.js**: Component-based UI
- **State Management**: Local state with hooks
- **CSS Modules**: Scoped styling
- **Responsive Design**: Mobile-first approach

## 📋 **Sample Data**

### **Sample Users**
- **Admin**: A001 / adminpass
- **Student**: 2022-00037 / password

### **Sample Schedules**
- **1st Year**: Monday-Friday, various times
- **Classrooms**: 307, 308, 309, 314, CL-1, CL-2
- **Instructors**: Prof. Santos, Prof. Garcia, Prof. Rodriguez, etc.

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   - Check MySQL service status
   - Verify `.env` configuration
   - Ensure database exists

2. **Tables Not Created**
   - Check Sequelize sync logs
   - Verify model imports
   - Check for syntax errors in models

3. **Registration Fails**
   - Check required field validation
   - Verify user authentication
   - Check database constraints

### **Debug Commands**
```bash
# Test database connection
npm run test-db

# Check server logs
npm run dev

# Verify database tables
mysql -u root -p registrar_db
SHOW TABLES;
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **Grade Management**: Track student performance
- **Attendance Tracking**: Monitor class attendance
- **Document Management**: Handle student documents
- **Notification System**: Automated reminders
- **Reporting**: Academic progress reports

### **Integration Possibilities**
- **LMS Integration**: Connect with learning management systems
- **Payment Systems**: Integrate with accounting systems
- **Mobile Apps**: Native mobile applications
- **API Gateway**: Centralized API management

## 📞 **Support**

For technical support or questions:
- Check the logs for error details
- Verify database connectivity
- Ensure all environment variables are set
- Review model associations and constraints

---

**🎉 Congratulations!** Your BSIT Curriculum & Student Registration System is now ready to use. Students can register with their complete information and automatically get enrolled in appropriate schedules based on their year level.
