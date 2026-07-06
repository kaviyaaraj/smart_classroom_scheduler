# 🚀 Complete Installation & Usage Guide

## Smart Classroom and Timetable Scheduler

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Creating Test Data](#creating-test-data)
6. [Using the Application](#using-the-application)
7. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

Before you begin, ensure you have the following installed:

### Required Software:
- ✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- ✅ **Git** (optional) - [Download](https://git-scm.com/)

### Check Installation:
```bash
node --version
npm --version
mongod --version
```

---

## 2. Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd c:\Users\kaviy\OneDrive\Desktop\smart-classroom-scheduler
```

### Step 2: Automated Setup (Recommended)
```bash
# Double-click setup.bat or run:
setup.bat
```

### Step 3: Manual Setup (Alternative)

**Install Backend Dependencies:**
```bash
cd backend
npm install
```

**Install Frontend Dependencies:**
```bash
cd ..\frontend
npm install
```

---

## 3. Database Setup

### Step 1: Start MongoDB Service

**Windows:**
```bash
# Start MongoDB as a service
net start MongoDB

# Or start manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
# or
sudo service mongod start
```

### Step 2: Verify MongoDB is Running
```bash
# Connect to MongoDB shell
mongo
# or
mongosh

# You should see MongoDB shell prompt
```

### Step 3: Configure Environment Variables

The `.env` file is already created in the backend folder with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-classroom
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**⚠️ Important:** Change `JWT_SECRET` for production use!

---

## 4. Running the Application

### Method 1: Using Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on: http://localhost:3000

### Method 2: Development Mode with Auto-Reload

**Backend (with nodemon):**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

---

## 5. Creating Test Data

### Option 1: Automated Seeding (Recommended)

```bash
cd backend
npm run seed
```

This will create:
- ✅ 1 Admin user
- ✅ 3 Teacher users
- ✅ 10 Student users
- ✅ 5 Classrooms
- ✅ 6 Subjects

**Test Credentials Created:**
```
Admin:
  Email: admin@test.com
  Password: admin123

Teacher:
  Email: john@test.com
  Password: teacher123

Student:
  Email: student1@test.com
  Password: student123
```

### Option 2: Manual User Creation via API

Use Postman or any API client:

**Create Admin:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin",
  "phone": "1234567890",
  "department": "Administration"
}
```

**Create Teacher:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Teacher",
  "email": "teacher@test.com",
  "password": "teacher123",
  "role": "teacher",
  "phone": "1234567891",
  "department": "Computer Science"
}
```

**Create Student:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Jane Student",
  "email": "student@test.com",
  "password": "student123",
  "role": "student",
  "phone": "1234567892",
  "class": "CS-A",
  "rollNumber": "CS001"
}
```

---

## 6. Using the Application

### Step 1: Access the Application
Open your browser and go to: **http://localhost:3000**

### Step 2: Login

Use one of the test credentials:
- Admin: `admin@test.com` / `admin123`
- Teacher: `john@test.com` / `teacher123`
- Student: `student1@test.com` / `student123`

---

## 📱 Feature Walkthrough

### 👨💼 As Admin

#### 1. View Dashboard
- See statistics (classrooms, teachers, students)
- View dashboard cards

#### 2. Add Classroom
1. Click "Manage Classrooms"
2. Fill in the form:
   - Classroom Name
   - Room Number
   - Capacity
   - Building
   - Floor
3. Click "Add Classroom"

#### 3. Generate Timetable
1. Enter class name (e.g., "CS-A")
2. Click "Generate Timetable"
3. View generated timetable by clicking "View Timetable"

#### 4. Send Notification
1. Click "Send Notification"
2. Fill in:
   - Title
   - Message
   - Recipients (All Students/All Teachers/Specific Class)
   - Class name (if specific class selected)
3. Click "Send Notification"

#### 5. View Timetable
1. Click "View Timetable"
2. Enter class name
3. See weekly schedule in grid format

---

### 👨🏫 As Teacher

#### 1. View Dashboard
- See today's classes count
- View total classes
- Check notifications

#### 2. View Today's Schedule
- Automatically displayed on dashboard
- Shows time, subject, and classroom

#### 3. Mark Attendance
1. Click "Mark Attendance"
2. Fill in:
   - Student ID
   - Subject ID
   - Class
   - Date
   - Status (Present/Absent/Late)
3. Click "Mark Attendance"

#### 4. View Full Timetable
1. Click "View Full Timetable"
2. See your complete weekly schedule

#### 5. View Notifications
- Scroll down to see all notifications from admin

---

### 👨🎓 As Student

#### 1. View Dashboard
- See today's classes
- Check attendance percentage
- View total classes attended
- See notification count

#### 2. View Today's Schedule
- Automatically displayed on dashboard
- Shows time, subject, teacher, and classroom

#### 3. View Full Timetable
1. Click "View Timetable"
2. See complete weekly schedule

#### 4. Check Attendance
- View recent attendance records on dashboard
- See attendance status (Present/Absent/Late)
- Check attendance percentage

#### 5. View Notifications
- Scroll down to see all notifications

---

## 7. Troubleshooting

### Problem: MongoDB Connection Error

**Solution:**
```bash
# Check if MongoDB is running
net start MongoDB

# Or start manually
mongod --dbpath="C:\data\db"
```

### Problem: Port 5000 Already in Use

**Solution:**
Edit `backend/.env`:
```env
PORT=5001
```

Then update `frontend/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5001/api';
```

### Problem: Port 3000 Already in Use

**Solution:**
When prompted, type `Y` to run on different port, or:
```bash
# Windows
set PORT=3001 && npm start

# Linux/Mac
PORT=3001 npm start
```

### Problem: Cannot Login

**Solution:**
1. Check if backend is running
2. Check browser console for errors
3. Verify user exists in database
4. Try creating new user with seed script

### Problem: Timetable Not Generating

**Solution:**
1. Ensure subjects exist for the class
2. Ensure classrooms are available
3. Check backend console for errors
4. Verify teachers are assigned to subjects

### Problem: npm install Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: React App Not Loading

**Solution:**
1. Check if frontend is running on port 3000
2. Clear browser cache
3. Check browser console for errors
4. Restart frontend server

---

## 🔍 Verification Checklist

Before using the application, verify:

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] No errors in backend console
- [ ] No errors in frontend console
- [ ] Test users are created
- [ ] Can access http://localhost:3000
- [ ] Can login successfully

---

## 📊 API Testing with Postman

### Import Collection

Create a Postman collection with these endpoints:

**Base URL:** `http://localhost:5000/api`

**Headers for Protected Routes:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Test Endpoints:

1. **Register User**
   - POST `/auth/register`

2. **Login**
   - POST `/auth/login`

3. **Get Profile**
   - GET `/auth/profile`

4. **Get Classrooms**
   - GET `/classrooms`

5. **Generate Timetable**
   - POST `/timetable/generate`

---

## 🎯 Quick Start Summary

```bash
# 1. Start MongoDB
net start MongoDB

# 2. Seed Database (Optional but Recommended)
cd backend
npm run seed

# 3. Start Backend (Terminal 1)
cd backend
npm start

# 4. Start Frontend (Terminal 2)
cd frontend
npm start

# 5. Open Browser
http://localhost:3000

# 6. Login
admin@test.com / admin123
```

---

## 📞 Need Help?

1. Check **README.md** for detailed documentation
2. Review **QUICKSTART.md** for quick setup
3. See **PROJECT_STRUCTURE.md** for file organization
4. Check **PROJECT_SUMMARY.md** for feature overview

---

## 🎉 Success!

If you can:
- ✅ Login successfully
- ✅ See your dashboard
- ✅ Navigate between pages
- ✅ Perform role-specific actions

**Congratulations! Your Smart Classroom Scheduler is working perfectly!** 🎊

---

**Happy Scheduling! 📚✨**
