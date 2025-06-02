# No Admin Setup Guide - Disease Risk Prediction App

## Setup Without Administrator Rights

Since you can't install software, here are alternative approaches to work with the project:

### Option 1: Use GitHub Web Interface + Portable Tools

#### Step 1: Download Portable Git
1. **Download Git Portable:**
   - Go to https://git-scm.com/download/win
   - Click "Portable Git" (not the installer)
   - Download the `.exe` file (e.g., `PortableGit-2.43.0-64-bit.7z.exe`)
   - Run it and extract to `C:\Users\akhura28\PortableGit`

2. **Test Git:**
   ```bash
   C:\Users\akhura28\PortableGit\bin\git.exe --version
   ```

#### Step 2: Download Node.js Portable
1. **Download Node.js Binary:**
   - Go to https://nodejs.org/en/download/
   - Download "Windows Binary (.zip)" - 64-bit
   - Extract to `C:\Users\akhura28\nodejs`

2. **Test Node.js:**
   ```bash
   C:\Users\akhura28\nodejs\node.exe --version
   C:\Users\akhura28\nodejs\npm.cmd --version
   ```

#### Step 3: Clone Repository Using Portable Git
```bash
cd C:\Users\akhura28\Desktop
C:\Users\akhura28\PortableGit\bin\git.exe clone https://github.com/av1mkhurana/disease-risk-prediction-app.git
cd disease-risk-prediction-app
```

#### Step 4: Install Dependencies
```bash
cd frontend
C:\Users\akhura28\nodejs\npm.cmd install
```

#### Step 5: Run Development Server
```bash
C:\Users\akhura28\nodejs\npm.cmd start
```

### Option 2: Use GitHub Codespaces (Cloud Development)

This is the easiest option if you have a GitHub account:

1. **Access GitHub Codespaces:**
   - Go to https://github.com/av1mkhurana/disease-risk-prediction-app
   - Click the green "Code" button
   - Select "Codespaces" tab
   - Click "Create codespace on main"

2. **Everything is pre-installed in the cloud:**
   - Git, Node.js, npm, Python all available
   - VS Code interface in browser
   - Terminal access
   - No local installation needed

3. **Run the project:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Option 3: Use GitHub Desktop (If Allowed)

GitHub Desktop sometimes installs without admin rights:

1. **Try GitHub Desktop:**
   - Download from https://desktop.github.com/
   - Try to install (it might work without admin)
   - If successful, clone the repository through the GUI

### Option 4: Download Project as ZIP

If Git doesn't work:

1. **Download ZIP:**
   - Go to https://github.com/av1mkhurana/disease-risk-prediction-app
   - Click green "Code" button
   - Select "Download ZIP"
   - Extract to your desired location

2. **Work locally and upload changes manually:**
   - Make changes to files
   - Use GitHub web interface to upload changed files
   - Create pull requests through web interface

## Working Without Git (Web-based workflow)

### Making Changes:
1. **Edit files locally** using any text editor
2. **Upload through GitHub web interface:**
   - Go to the file on GitHub.com
   - Click "Edit this file" (pencil icon)
   - Copy/paste your changes
   - Commit directly through web interface

### Creating New Files:
1. **Go to repository on GitHub.com**
2. **Click "Add file" > "Create new file"**
3. **Type filename and content**
4. **Commit through web interface**

## Batch Files for Easy Commands

Create these `.bat` files in your project directory for easier access:

### `start-frontend.bat`
```batch
@echo off
cd frontend
C:\Users\akhura28\nodejs\npm.cmd start
pause
```

### `install-deps.bat`
```batch
@echo off
cd frontend
C:\Users\akhura28\nodejs\npm.cmd install
pause
```

### `git-status.bat`
```batch
@echo off
C:\Users\akhura28\PortableGit\bin\git.exe status
pause
```

### `git-push.bat`
```batch
@echo off
C:\Users\akhura28\PortableGit\bin\git.exe add .
set /p message="Enter commit message: "
C:\Users\akhura28\PortableGit\bin\git.exe commit -m "%message%"
C:\Users\akhura28\PortableGit\bin\git.exe push
pause
```

## Recommended Approach

**For your situation, I recommend:**

1. **Use GitHub Codespaces** (Option 2) - Easiest, everything in the cloud
2. **If Codespaces isn't available:** Use portable tools (Option 1)
3. **For simple edits:** Use GitHub web interface (Option 4)

## Current Project Status

✅ **What's Ready:**
- Enhanced UI/UX with compelling messaging
- Complete project structure
- All dependencies defined in package.json
- Docker configuration (if Docker is available)

🎯 **Next Steps After Setup:**
1. Get the project running locally or in Codespaces
2. Continue UI/UX development
3. Implement authentication forms
4. Build data collection interface
5. Create health dashboard

## Quick Test Commands

After setup, test with:
```bash
# Check if everything works
cd disease-risk-prediction-app/frontend
C:\Users\akhura28\nodejs\npm.cmd --version
C:\Users\akhura28\nodejs\npm.cmd start
```

The project should open in your browser at http://localhost:3000

**GitHub Codespaces is probably your best option** - it requires no local installation and gives you a full development environment in the cloud!
