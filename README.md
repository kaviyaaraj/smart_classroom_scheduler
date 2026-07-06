# Smart Classroom and Timetable Scheduler

A full-stack web application for managing classrooms, subjects, and automatic timetable generation with role-based access for Admin, Teachers, and Students.

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Features

### Admin Features
- Dashboard with statistics
- Add/Edit/Delete Classrooms
- Manage Subjects
- Automatic Timetable Generation
- View and Edit Timetables
- Send Notifications to Students/Teachers
- User Management

### Teacher Features
- View Today's Schedule
- View Full Timetable
- Mark Attendance
- Upload Study Materials
- View Notifications

### Student Features
- View Timetable
- View Attendance Records
- Download Study Materials
- View Notifications
- Attendance Percentage

## Project Structure

```
smart-classroom-scheduler/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── classroomController.js
│   │   ├── subjectController.js
│   │   ├── timetableController.js
│   │   ├── attendanceController.js
│   │   ├── materialController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Classroom.js
│   │   ├── Subject.js
│   │   ├── Timetable.js
│   │   ├── Attendance.js
│   │   ├── Material.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── classroomRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── timetableRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── materialRoutes.js
│   │   └── notificationRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Login.css
    │   │   ├── AdminDashboard.js
    │   │   ├── TeacherDashboard.js
    │   │   ├── StudentDashboard.js
    │   │   ├── Dashboard.css
    │   │   ├── Timetable.js
    │   │   └── Timetable.css
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── classroomService.js
    │   │   ├── timetableService.js
    │   │   ├── attendanceService.js
    │   │   └── notificationService.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-classroom
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. Make sure MongoDB is running on your system:
```bash
# For Windows (if MongoDB is installed as a service)
net start MongoDB

# For Linux/Mac
sudo systemctl start mongod
# or
mongod
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Database Configuration

The application will automatically create the database and collections when you start the backend server. MongoDB connection string is configured in the `.env` file.

### Default Database Name
- `smart-classroom`

### Collections Created
- users
- classrooms
- subjects
- timetables
- attendances
- materials
- notifications

## Creating Test Users

You can create test users by making POST requests to `/api/auth/register` or use a tool like Postman:

### Admin User
```json
{
  "name": "Admin User",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin",
  "phone": "1234567890",
  "department": "Administration"
}
```

### Teacher User
```json
{
  "name": "John Teacher",
  "email": "teacher@school.com",
  "password": "teacher123",
  "role": "teacher",
  "phone": "1234567891",
  "department": "Computer Science"
}
```

### Student User
```json
{
  "name": "Jane Student",
  "email": "student@school.com",
  "password": "student123",
  "role": "student",
  "phone": "1234567892",
  "class": "CS-A",
  "rollNumber": "CS001"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Classrooms
- `GET /api/classrooms` - Get all classrooms (Protected)
- `POST /api/classrooms` - Create classroom (Admin only)
- `GET /api/classrooms/:id` - Get single classroom (Protected)
- `PUT /api/classrooms/:id` - Update classroom (Admin only)
- `DELETE /api/classrooms/:id` - Delete classroom (Admin only)

### Subjects
- `GET /api/subjects` - Get all subjects (Protected)
- `POST /api/subjects` - Create subject (Admin only)
- `GET /api/subjects/:id` - Get single subject (Protected)
- `PUT /api/subjects/:id` - Update subject (Admin only)
- `DELETE /api/subjects/:id` - Delete subject (Admin only)

### Timetable
- `POST /api/timetable/generate` - Generate timetable (Admin only)
- `GET /api/timetable` - Get timetable by class (Protected)
- `GET /api/timetable/teacher` - Get teacher's timetable (Teacher only)
- `PUT /api/timetable/:id` - Update timetable entry (Admin only)
- `DELETE /api/timetable/:id` - Delete timetable entry (Admin only)

### Attendance
- `POST /api/attendance` - Mark attendance (Teacher only)
- `GET /api/attendance` - Get attendance records (Protected)
- `GET /api/attendance/student` - Get student's attendance (Student only)
- `PUT /api/attendance/:id` - Update attendance (Teacher only)

### Materials
- `POST /api/materials` - Upload material (Teacher only)
- `GET /api/materials` - Get materials (Protected)
- `GET /api/materials/student` - Get student's materials (Student only)
- `DELETE /api/materials/:id` - Delete material (Teacher/Admin)

### Notifications
- `POST /api/notifications` - Create notification (Admin only)
- `GET /api/notifications` - Get notifications (Protected)
- `PUT /api/notifications/:id/read` - Mark as read (Protected)
- `DELETE /api/notifications/:id` - Delete notification (Admin only)

## Usage

1. Start MongoDB service
2. Start the backend server: `cd backend && npm start`
3. Start the frontend server: `cd frontend && npm start`
4. Open browser and navigate to `http://localhost:3000`
5. Login with test credentials or register new users
6. Based on role, you'll be redirected to respective dashboard

## Automatic Timetable Generation

The system automatically generates timetables with the following constraints:
- No teacher can have two classes at the same time
- One classroom can host only one class per time slot
- Each subject is assigned to its designated teacher
- Weekly schedule from Monday to Saturday
- 6 time slots per day (09:00 AM to 04:00 PM with lunch break)

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with role-based access control
- Token stored in localStorage
- Middleware for authorization

## Future Enhancements

- Email notifications
- File upload for study materials
- Attendance reports and analytics
- Export timetable as PDF
- Real-time notifications using Socket.io
- Mobile responsive design improvements
- Dark mode theme

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MongoDB URI in `.env` file
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in backend `.env` file
- Change port in frontend `src/services/api.js`

### CORS Error
- Ensure backend CORS is configured properly
- Check API_URL in frontend `src/services/api.js`

## License

MIT License

## Author

Smart Classroom Scheduler Team

## Support

For support, email support@smartclassroom.com
