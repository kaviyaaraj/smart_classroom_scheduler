@echo off
echo ========================================
echo Smart Classroom Scheduler - Setup Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b %errorlevel%
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b %errorlevel%
)
echo Frontend dependencies installed successfully!
echo.

echo [3/4] Checking MongoDB...
echo Please make sure MongoDB is installed and running.
echo To start MongoDB service, run: net start MongoDB
echo.

echo [4/4] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Make sure MongoDB is running
echo 2. Open TWO command prompts
echo.
echo In Terminal 1 (Backend):
echo    cd backend
echo    npm start
echo.
echo In Terminal 2 (Frontend):
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser: http://localhost:3000
echo ========================================
echo.
pause
