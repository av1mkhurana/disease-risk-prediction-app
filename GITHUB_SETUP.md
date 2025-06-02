# GitHub CLI Setup Guide - Disease Risk Prediction App

## Quick Setup with GitHub CLI (Recommended)

GitHub CLI (gh) is the easiest way to work with GitHub repositories and includes Git functionality.

### Step 1: Install GitHub CLI
1. **Download GitHub CLI:**
   - Go to https://cli.github.com/
   - Click "Download for Windows"
   - Download the `.msi` installer
   - Run the installer (usually doesn't require admin privileges)

2. **Verify Installation:**
   Open Command Prompt and run:
   ```bash
   gh --version
   git --version
   ```

### Step 2: Authenticate with GitHub
```bash
gh auth login
```
- Choose "GitHub.com"
- Choose "HTTPS" 
- Choose "Login with a web browser"
- Follow the browser authentication flow
- Paste the one-time code when prompted

### Step 3: Install Node.js (Portable)
1. **Download Node.js:**
   - Go to https://nodejs.org/en/download/
   - Download "Windows Binary (.zip)" - NOT the installer
   - Extract to `C:\Users\akhura28\nodejs`

2. **Add to PATH:**
   ```bash
   setx PATH "%PATH%;C:\Users\akhura28\nodejs"
   ```
   - Close and reopen Command Prompt
   - Test: `node --version` and `npm --version`

### Step 4: Clone and Setup Repository
```bash
# Navigate to your desired location
cd C:\Users\akhura28\Desktop

# Clone the repository
gh repo clone av1mkhurana/disease-risk-prediction-app

# Navigate to project
cd disease-risk-prediction-app

# Install frontend dependencies
cd frontend
npm install

# Go back to project root
cd ..
```

### Step 5: Install Python Dependencies (Optional)
If you want to run the backend:
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Step 6: Run the Application

**Option A: Frontend Only (for UI development)**
```bash
cd frontend
npm start
```
Access at: http://localhost:3000

**Option B: Full Stack with Docker**
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Working with GitHub

### Making Changes and Pushing
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push
```

### Creating Pull Requests
```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes, commit them
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/your-feature-name

# Create pull request using GitHub CLI
gh pr create --title "Your PR Title" --body "Description of changes"
```

### Useful GitHub CLI Commands
```bash
# View repository info
gh repo view

# List issues
gh issue list

# Create new issue
gh issue create

# View pull requests
gh pr list

# Check out a pull request
gh pr checkout [PR-NUMBER]

# View repository in browser
gh repo view --web
```

## Troubleshooting

### If npm install fails:
1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Set npm prefix:**
   ```bash
   npm config set prefix C:\Users\akhura28\npm-global
   setx PATH "%PATH%;C:\Users\akhura28\npm-global"
   ```

3. **Install with no optional dependencies:**
   ```bash
   npm install --no-optional
   ```

### If GitHub authentication fails:
1. **Re-authenticate:**
   ```bash
   gh auth logout
   gh auth login
   ```

2. **Use Personal Access Token:**
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate new token with repo permissions
   - Use token when prompted for password

### If PATH changes don't work:
1. **Restart Command Prompt completely**
2. **Or restart your computer**
3. **Check PATH manually:**
   ```bash
   echo %PATH%
   ```

## Current Project Status

✅ **Ready for Development:**
- Complete project structure
- Enhanced UI/UX with compelling messaging
- Backend API with ML models
- Frontend with improved user experience
- Docker development environment
- Comprehensive documentation

🎯 **Next Development Steps:**
1. Complete authentication forms
2. Build data collection interface
3. Create dashboard with health visualizations
4. Integrate frontend with backend APIs
5. Add real-time health insights

## Quick Commands Reference

```bash
# Start development
cd disease-risk-prediction-app/frontend
npm start

# View in browser
gh repo view --web

# Check git status
git status

# Quick commit and push
git add .
git commit -m "Update: description"
git push

# Create feature branch
git checkout -b feature/new-feature
```

The project is now ready for active development with improved UI/UX and proper GitHub integration!
