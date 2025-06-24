# 🔧 NPM "Not Recognized" - Complete Fix Guide

## 🚨 Problem
You're getting this error when trying to run npm commands in PowerShell:
```
npm : The term 'npm' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

## ✅ Solutions (Choose One)

### Option 1: Quick Fix for Current PowerShell Session
**Run this in your PowerShell:**
```powershell
.\setup-nodejs.ps1
```
This adds Node.js to your current PowerShell session. You'll need to run it each time you open a new PowerShell window.

### Option 2: Permanent Fix (Recommended)
**Double-click this file:**
```
add-nodejs-to-path.bat
```
This permanently adds Node.js to your system PATH. After running this:
1. **Restart your PowerShell/Terminal**
2. npm commands will work everywhere

### Option 3: Use the Batch Files (Always Works)
**Use these instead of direct npm commands:**
- `install-deps.bat` - Instead of `npm install`
- `start-dev.bat` - Instead of `npm run dev`
- `dev-workflow.bat` - Complete development menu

## 🎯 After Fixing, You Can Run:

```bash
# Check versions
npm --version
node --version

# Install dependencies
npm install

# Start development server
npm run dev
npm start

# Other npm commands
npm run build
npm test
```

## 🔍 Why This Happens

Node.js is installed in a portable folder, not in the system PATH. Windows doesn't know where to find npm unless we tell it.

## 🚀 Quick Start After Fix

1. **Fix npm access** (choose option 1 or 2 above)
2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
3. **Start development:**
   ```bash
   npm run dev
   ```
4. **Open browser:** http://localhost:3000

## 💡 Pro Tips

- **Option 2 (Permanent Fix)** is best for regular development
- **Option 1 (PowerShell Script)** is good for quick testing
- **Option 3 (Batch Files)** always works without any setup

## 🆘 If Nothing Works

Use the full path to npm:
```bash
C:\Users\akhura28\Downloads\nodejs-portable\node-v20.10.0-win-x64\npm.cmd --version
```

Your Disease Risk Prediction App is ready - just fix npm access first! 🚀
