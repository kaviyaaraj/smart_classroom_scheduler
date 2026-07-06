# Quick Start Guide - Smart Classroom Scheduler

## Step-by-Step Setup

### 1. Install MongoDB
Download and install MongoDB from: https://www.mongodb.com/try/download/community

### 2. Start MongoDB Service
**Windows:**
```bash
net start MongoDB
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
```

### 3. Setup Backend

Open Command Prompt/Terminal and run:

```bash
cd backend
npm install
```

Create `.env` file in backend folder with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-classroom
JWT_SECRET=mysecretkey123
NODE_ENV=development
```

Start backend server:
```bash
npm start
```

### 4. Setup Frontend

Open a NEW Command Prompt/Terminal and run:

```bash
cd frontend
npm install
npm start
```

### 5. Access Application

Open browser and go to: http://localhost:3000

### 6. Create Test Users

Use Postman or any API client to create users:

**Create Admin:**
POST http://localhost:5000/api/auth/register
```json
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

**Create Teacher:**
POST http://localhost:5000/api/auth/register
```json
{
  "name": "Teacher",
  "email": "teacher@test.com",
  "password": "teacher123",
  "role": "teacher",
  "department": "Computer Science"
}
```

**Create Student:**
POST http://localhost:5000/api/auth/register
```json
{
  "name": "Student",
  "email": "student@test.com",
  "password": "student123",
  "role": "student",
  "class": "CS-A",
  "rollNumber": "001"
}
```

### 7. Login

Go to http://localhost:3000/login and use:
- Admin: admin@test.com / admin123
- Teacher: teacher@test.com / teacher123
- Student: student@test.com / student123

### 8. Test Features

**As Admin:**
1. Add classrooms
2. Add subjects
3. Generate timetable
4. Send notifications

**As Teacher:**
1. View schedule
2. Mark attendance
3. Upload materials

**As Student:**
1. View timetable
2. Check attendance
3. View notifications

## Common Issues

**Issue: MongoDB not connecting**
Solution: Make sure MongoDB service is running

**Issue: Port 5000 already in use**
Solution: Change PORT in backend .env file

**Issue: Cannot connect to backend**
Solution: Check if backend server is running on port 5000

## Need Help?

Check the main README.md file for detailed documentation.
