#!/bin/bash
# scripts/dev.sh - Development script for cross-platform use

echo "Starting Spintember in development mode..."

# Kill any existing processes on port 5173
echo "Checking for existing processes on port 5173..."
if command -v lsof &> /dev/null; then
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
elif command -v netstat &> /dev/null; then
    netstat -ano | findstr :5173 | findstr LISTENING | for /f "tokens=5" %a in ('more') do taskkill /PID %a /F 2>nul || true
fi

# Start the development environment
npm run electron-dev