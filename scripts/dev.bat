@echo off
REM scripts/dev.bat - Windows development script

echo Starting Spintember in development mode...

REM Kill any existing processes on port 5173
echo Checking for existing processes on port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Start the development environment
npm run electron-dev