# Smart Classroom Scheduler - Complete Project Structure

## 📁 Project Directory Tree

```
smart-classroom-scheduler/
│
├── 📄 README.md                          # Complete documentation
├── 📄 QUICKSTART.md                      # Quick start guide
├── 📄 .gitignore                         # Git ignore file
│
├── 📁 backend/                           # Backend Node.js application
│   │
│   ├── 📁 config/
│   │   └── 📄 db.js                      # MongoDB connection configuration
│   │
│   ├── 📁 controllers/                   # Business logic controllers
│   │   ├── 📄 authController.js          # Authentication (login, register)
│   │   ├── 📄 classroomController.js     # Classroom CRUD operations
│   │   ├── 📄 subjectController.js       # Subject management
│   │   ├── 📄 timetableController.js     # Timetable generation & management
│   │   ├── 📄 attendanceController.js    # Attendance marking & viewing
│   │   ├── 📄 materialController.js      # Study materials upload/download
│   │   └── 📄 notificationController.js  # Notification system
│   │
│   ├── 📁 middleware/
│   │   └── 📄 auth.js                    # JWT authentication & authorization
│   │
│   ├── 📁 models/                        # MongoDB Mongoose schemas
│   │   ├── 📄 User.js                    # User model (Admin/Teacher/Student)
│   │   ├── 📄 Classroom.js               # Classroom model
│   │   ├── 📄 Subject.js                 # Subject model
│   │   ├── 📄 Timetable.js               # Timetable model
│   │   ├── 📄 Attendance.js              # Attendance model
│   │   ├── 📄 Material.js                # Study material model
│   │   └── 📄 Notification.js            # Notification model
│   │
│   ├── 📁 routes/                        # API route definitions
│   │   ├── 📄 authRoutes.js              # /api/auth routes
│   │   ├── 📄 classroomRoutes.js         # /api/classrooms routes
│   │   ├── 📄 subjectRoutes.js           # /api/subjects routes
│   │   ├── 📄 timetableRoutes.js         # /api/timetable routes
│   │   ├── 📄 attendanceRoutes.js        # /api/attendance routes
│   │   ├── 📄 materialRoutes.js          # /api/materials routes
│   │   └── 📄 notificationRoutes.js      # /api/notifications routes
│   │
│   ├── 📄 .env                           # Environment variables
│   ├── 📄 package.json                   # Backend dependencies
│   └── 📄 server.js                      # Main server entry point
│
└── 📁 frontend/                          # Frontend React application
    │
    ├── 📁 public/
    │   └── 📄 index.html                 # HTML template
    │
    ├── 📁 src/
    │   │
    │   ├── 📁 components/                # Reusable React components
    │   │   └── 📄 PrivateRoute.js        # Protected route component
    │   │
    │   ├── 📁 context/                   # React Context API
    │   │   └── 📄 AuthContext.js         # Authentication context & state
    │   │
    │   ├── 📁 pages/                     # Page components
    │   │   ├── 📄 Login.js               # Login page
    │   │   ├── 📄 Login.css              # Login styles
    │   │   ├── 📄 AdminDashboard.js      # Admin dashboard
    │   │   ├── 📄 TeacherDashboard.js    # Teacher dashboard
    │   │   ├── 📄 StudentDashboard.js    # Student dashboard
    │   │   ├── 📄 Dashboard.css          # Dashboard styles
    │   │   ├── 📄 Timetable.js           # Timetable view page
    │   │   └── 📄 Timetable.css          # Timetable styles
    │   │
    │   ├── 📁 services/                  # API service layer
    │   │   ├── 📄 api.js                 # Axios configuration
    │   │   ├── 📄 authService.js         # Auth API calls
    │   │   ├── 📄 classroomService.js    # Classroom API calls
    │   │   ├── 📄 timetableService.js    # Timetable API calls
    │   │   ├── 📄 attendanceService.js   # Attendance API calls
    │   │   └── 📄 notificationService.js # Notification API calls
    │   │
    │   ├── 📄 App.js                     # Main App component with routing
    │   ├── 📄 App.css                    # App styles
    │   ├── 📄 index.js                   # React entry point
    │   └── 📄 index.css                  # Global styles
    │
    └── 📄 package.json                   # Frontend dependencies
```

## 🎯 Key Features by Role

### 👨‍💼 Admin Features
- ✅ Dashboard with statistics
- ✅ Classroom management (Add/Edit/Delete)
- ✅ Subject management
- ✅ Automatic timetable generation
- ✅ View and edit timetables
- ✅ Send notifications to students/teachers
- ✅ User management

### 👨‍🏫 Teacher Features
- ✅ View today's schedule
- ✅ View full timetable
- ✅ Mark student attendance
- ✅ Upload study materials
- ✅ View notifications

### 👨‍🎓 Student Features
- ✅ View personal timetable
- ✅ View attendance records
- ✅ Check attendance percentage
- ✅ Download study materials
- ✅ View notifications

## 🔧 Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **CORS:** cors middleware

### Frontend
- **Library:** React.js 18
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** CSS3

## 🚀 API Endpoints Summary

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get profile

### Classrooms
- GET/POST `/api/classrooms`
- GET/PUT/DELETE `/api/classrooms/:id`

### Subjects
- GET/POST `/api/subjects`
- GET/PUT/DELETE `/api/subjects/:id`

### Timetable
- POST `/api/timetable/generate` - Auto-generate
- GET `/api/timetable` - Get by class
- GET `/api/timetable/teacher` - Teacher's schedule
- PUT/DELETE `/api/timetable/:id`

### Attendance
- POST `/api/attendance` - Mark attendance
- GET `/api/attendance` - Get records
- GET `/api/attendance/student` - Student's attendance

### Materials
- POST `/api/materials` - Upload
- GET `/api/materials` - Get all
- GET `/api/materials/student` - Student's materials

### Notifications
- POST `/api/notifications` - Create
- GET `/api/notifications` - Get all
- PUT `/api/notifications/:id/read` - Mark read

## 📊 Database Collections

1. **users** - Admin, Teacher, Student accounts
2. **classrooms** - Physical classroom details
3. **subjects** - Subject information
4. **timetables** - Generated schedules
5. **attendances** - Attendance records
6. **materials** - Study materials metadata
7. **notifications** - System notifications

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API routes
- Token validation middleware
- Secure password storage

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-classroom
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 🎨 UI Features

- Responsive design
- Modern gradient backgrounds
- Card-based layouts
- Sidebar navigation
- Table views for data
- Form validations
- Loading states
- Error handling
- Role-based UI rendering

## 📦 Total Files Created

- **Backend:** 23 files
- **Frontend:** 18 files
- **Documentation:** 3 files
- **Total:** 44 files

## ⚡ Quick Commands

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

## 📚 Documentation Files

1. **README.md** - Complete project documentation
2. **QUICKSTART.md** - Quick setup guide
3. **PROJECT_STRUCTURE.md** - This file

---

**Project Status:** ✅ Complete and Ready to Run

**Last Updated:** 2024
