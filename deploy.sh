#!/bin/bash

# Timely Smart Attendance - Deployment Script
echo "🚀 Deploying Timely Smart Attendance System to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Timely Smart Attendance System"
    echo "✅ Git repository initialized"
else
    echo "📦 Git repository already exists"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
else
    echo "🔄 Pushing to GitHub..."
    git add .
    git commit -m "Deploy to Render - $(date)"
    git push origin main
    echo "✅ Code pushed to GitHub"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Render will auto-detect the render.yaml configuration"
echo "5. Click 'Create Web Service'"
echo ""
echo "🌐 Your app will be available at: https://timely-smart-attendance.onrender.com"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
