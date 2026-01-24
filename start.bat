@echo off
echo Starting KickOff Application...
echo.

echo 1. Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo    MongoDB is running
) else (
    echo    MongoDB is NOT running
    echo    Please start MongoDB manually
    pause
    exit /b
)

echo.
echo 2. Starting Backend Server...
cd backend
start "KickOff Backend" cmd /k npm start

echo    Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 3. Starting Frontend...
cd ..\frontend
npm run dev

pause
