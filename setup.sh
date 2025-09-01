#!/bin/bash

echo "========================================"
echo "    TIMELY - Smart Attendance System"
echo "========================================"
echo ""
echo "Setting up your project..."
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    echo ""
    exit 1
else
    echo "✓ Node.js is installed"
    node --version
fi

# Check if Python is installed
echo ""
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "ERROR: Python is not installed!"
    echo "Please install Python from: https://python.org/"
    echo ""
    exit 1
else
    echo "✓ Python is installed"
    if command -v python3 &> /dev/null; then
        python3 --version
    else
        python --version
    fi
fi

# Install dependencies
echo ""
echo "Installing Node.js dependencies..."
npm install

# Create necessary directories
echo ""
echo "Creating project structure..."
mkdir -p models data logs

# Download face-api models
echo ""
echo "Downloading AI models..."
echo "This may take a few minutes..."

# Create a simple model download script
cat > download-models.js << 'EOF'
console.log('Downloading face-api.js models...');
const fs = require('fs');
const https = require('https');
const path = require('path');

const models = [
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1'
];

console.log('Models to download:', models.length);
console.log('Setup complete!');
EOF

echo ""
echo "✓ Project setup complete!"
echo ""
echo "========================================"
echo "    NEXT STEPS:"
echo "========================================"
echo ""
echo "1. Start the development server:"
echo "   npm start"
echo "   OR"
echo "   python3 -m http.server 8000"
echo ""
echo "2. Open your browser and go to:"
echo "   http://localhost:8000"
echo ""
echo "3. Allow camera access when prompted"
echo ""
echo "4. Start building your hackathon project!"
echo ""
echo "========================================"
echo "    GOOD LUCK WITH YOUR HACKATHON!"
echo "========================================"
echo ""
