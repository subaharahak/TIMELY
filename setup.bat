@echo off
echo ========================================
echo    TIMELY - Smart Attendance System
echo ========================================
echo.
echo Setting up your project...
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo ✓ Node.js is installed
    node --version
)

REM Check if Python is installed
echo.
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install Python from: https://python.org/
    echo.
    pause
    exit /b 1
) else (
    echo ✓ Python is installed
    python --version
)

REM Install dependencies
echo.
echo Installing Node.js dependencies...
npm install

REM Create necessary directories
echo.
echo Creating project structure...
if not exist "models" mkdir models
if not exist "data" mkdir data
if not exist "logs" mkdir logs

REM Download face-api models
echo.
echo Downloading AI models...
echo This may take a few minutes...

REM Create a simple model download script
echo console.log('Downloading face-api.js models...'); > download-models.js
echo const fs = require('fs'); >> download-models.js
echo const https = require('https'); >> download-models.js
echo const path = require('path'); >> download-models.js
echo. >> download-models.js
echo const models = [ >> download-models.js
echo   'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json', >> download-models.js
echo   'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1', >> download-models.js
echo   'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json', >> download-models.js
echo   'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1', >> download-models.js
echo   'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json', >> download-models.js
echo   'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1' >> download-models.js
echo ]; >> download-models.js

echo.
echo ✓ Project setup complete!
echo.
echo ========================================
echo    NEXT STEPS:
echo ========================================
echo.
echo 1. Start the development server:
echo    npm start
echo    OR
echo    python -m http.server 8000
echo.
echo 2. Open your browser and go to:
echo    http://localhost:8000
echo.
echo 3. Allow camera access when prompted
echo.
echo 4. Start building your hackathon project!
echo.
echo ========================================
echo    GOOD LUCK WITH YOUR HACKATHON!
echo ========================================
echo.
pause
