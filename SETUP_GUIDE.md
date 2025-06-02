# Setup Guide - Disease Risk Prediction App

## Prerequisites Installation (No Admin Required)

### 1. Install Node.js (Portable Version)
Since you don't have admin privileges, we'll use a portable version of Node.js:

1. **Download Node.js Portable:**
   - Go to https://nodejs.org/en/download/
   - Download the "Windows Binary (.zip)" version (not the installer)
   - Extract the zip file to a folder like `C:\Users\akhura28\nodejs`

2. **Add Node.js to PATH:**
   - Open Command Prompt
   - Run: `setx PATH "%PATH%;C:\Users\akhura28\nodejs"`
   - Close and reopen Command Prompt
   - Test: `node --version` and `npm --version`

### 2. Install Git (Portable Version)
1. **Download Git Portable:**
   - Go to https://git-scm.com/download/win
   - Download "Portable Git" (PortableGit-x.x.x-64-bit.7z.exe)
   - Extract to a folder like `C:\Users\akhura28\git`

2. **Add Git to PATH:**
   - Run: `setx PATH "%PATH%;C:\Users\akhura28\git\bin"`
   - Close and reopen Command Prompt
   - Test: `git --version`

## Alternative: Use GitHub Desktop
If you prefer a GUI approach:
1. Download GitHub Desktop from https://desktop.github.com/
2. Install it (usually doesn't require admin)
3. Sign in with your GitHub account
4. Clone the repository: https://github.com/av1mkhurana/disease-risk-prediction-app

## Quick Setup Commands (After Installing Node.js and Git)

### 1. Initialize Git Repository
```bash
cd disease-risk-app
git init
git remote add origin https://github.com/av1mkhurana/disease-risk-prediction-app.git
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../backend
pip install -r requirements.txt
```

### 4. Commit and Push to GitHub
```bash
cd ..
git add .
git commit -m "Initial commit: Disease Risk Prediction App setup"
git branch -M main
git push -u origin main
```

## Running the Application

### Option 1: Using Docker (Recommended)
```bash
docker-compose up --build
```

### Option 2: Manual Setup
**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## Troubleshooting

### If npm install fails with permission errors:
1. **Set npm prefix to user directory:**
   ```bash
   npm config set prefix C:\Users\akhura28\npm-global
   setx PATH "%PATH%;C:\Users\akhura28\npm-global"
   ```

2. **Use --no-optional flag:**
   ```bash
   npm install --no-optional
   ```

### If Git push fails:
1. **Configure Git credentials:**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Use Personal Access Token:**
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with repo permissions
   - Use token as password when prompted

## Current Project Status
✅ **Complete:**
- Project structure and architecture
- Backend FastAPI application with ML models
- Frontend React + TypeScript application
- Docker development environment
- Comprehensive documentation

🔄 **Next Steps:**
1. Install Node.js and Git (portable versions)
2. Install npm dependencies
3. Initialize Git repository and push to GitHub
4. Complete authentication implementation
5. Build data collection forms
6. Create dashboard with visualizations

## Support
If you encounter issues:
1. Check the error messages carefully
2. Ensure all paths are correctly set
3. Try restarting Command Prompt after PATH changes
4. Use GitHub Desktop as an alternative to command-line Git

The project is well-structured and ready for development once the tools are installed!
