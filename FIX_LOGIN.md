# 🔧 Fix: Invalid Email or Password

## Problem
Login page shows "Invalid email or password" because no users exist in the database.

## Solution

### Step 1: Make sure MongoDB is running
```bash
net start MongoDB
```

### Step 2: Make sure Backend is running
```bash
cd backend
npm start
```

### Step 3: Create Test Users (Run in NEW terminal)
```bash
cd backend
npm run seed
```

This will create:
- Admin: `admin@test.com` / `admin123`
- Teacher: `john@test.com` / `teacher123`
- Student: `student1@test.com` / `student123`

### Step 4: Login
Go to http://localhost:3000 and use:
- **Email:** `admin@test.com`
- **Password:** `admin123`

---

## Alternative: Create User Manually via API

If seed doesn't work, use Postman or curl:

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Admin\",\"email\":\"admin@test.com\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

Then login with:
- Email: `admin@test.com`
- Password: `admin123`

---

## Troubleshooting

### If seed fails:
1. Check MongoDB is running: `net start MongoDB`
2. Check backend is running on port 5000
3. Check `.env` file exists in backend folder
4. Try deleting and recreating database

### If login still fails:
1. Open browser console (F12)
2. Check for errors
3. Verify backend is responding: http://localhost:5000
4. Check backend console for errors

---

## Quick Test

After running seed, try:
```
Email: admin@test.com
Password: admin123
```

Should redirect to Admin Dashboard ✅
