# Disease Risk Prediction App - Setup Instructions

## 🚀 Quick Start Guide

Follow these steps to run the Disease Risk Prediction App on a new computer.

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### 📥 Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/av1mkhurana/disease-risk-prediction-app.git
cd disease-risk-prediction-app
```

#### 2. Navigate to Frontend Directory
```bash
cd frontend
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Start the Development Server
```bash
npm start
```

#### 5. Open in Browser
The app will automatically open in your default browser at:
```
http://localhost:3001
```

If it doesn't open automatically, manually navigate to the URL above.

### 🎯 What You Should See

1. **Homepage**: Modern landing page with gradient background and health assessment call-to-action
2. **Assessment Flow**: 4-step health risk assessment with AI-powered recommendations
3. **Results**: Personalized health insights and actionable recommendations

### 🔧 Troubleshooting

#### Common Issues and Solutions

**Issue: `npm install` fails**
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

**Issue: Port 3001 is already in use**
```bash
# Kill process using port 3001
npx kill-port 3001
# Or start on a different port
PORT=3002 npm start
```

**Issue: Node version too old**
```bash
# Check your Node.js version
node --version
# If below v16, update Node.js from nodejs.org
```

**Issue: Permission errors on macOS/Linux**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### 📁 Project Structure

```
disease-risk-prediction-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # Landing page
│   │   │   └── AssessmentPage.tsx # Health assessment
│   │   ├── App.tsx               # Main app component
│   │   └── index.tsx             # Entry point
│   ├── package.json              # Dependencies
│   └── public/                   # Static assets
├── backend/                      # Backend API (if needed)
├── memory-bank/                  # Project documentation
└── README.md                     # Project overview
```

### 🔑 Environment Variables (Optional)

The app works out of the box, but you can customize settings:

Create a `.env` file in the `frontend/` directory:
```bash
# Custom port (default: 3001)
PORT=3001

# API endpoints (if using custom backend)
REACT_APP_API_URL=http://localhost:3000
```

### 🤖 AI Integration

The app uses Groq LLM for health recommendations:
- **API**: Groq Cloud API
- **Model**: meta-llama/llama-4-scout-17b-16e-instruct
- **Features**: Personalized health insights, risk analysis, actionable recommendations

### 🛠️ Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Check for linting issues
npm run lint
```

### 🌐 Production Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

#### Deploy to Static Hosting
The `build/` folder contains the production-ready files that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

### 📱 Features Overview

#### ✅ **Working Features**
- **2-Minute Health Assessment**: Quick, comprehensive evaluation
- **AI-Powered Recommendations**: Personalized advice using Groq LLM
- **Modern UI**: Beautiful, responsive design with animations
- **No Signup Required**: Truly free access without barriers
- **Privacy-Focused**: Secure data handling with proper disclaimers

#### 🎨 **UI/UX Highlights**
- Glass morphism design with backdrop blur effects
- Gradient backgrounds and smooth animations
- Professional healthcare-appropriate styling
- Responsive design for all device sizes
- Loading states and progress indicators

### 🔒 Privacy & Security

- **No Data Storage**: Assessment data is not permanently stored
- **Secure API Calls**: HTTPS encryption for all external requests
- **Medical Disclaimers**: Proper disclaimers throughout the application
- **Educational Purpose**: Clear positioning as educational tool

### 📞 Support

If you encounter any issues:

1. **Check the Console**: Open browser developer tools (F12) and check for errors
2. **Verify Prerequisites**: Ensure Node.js and npm are properly installed
3. **Clear Cache**: Try clearing browser cache and npm cache
4. **Check Network**: Ensure internet connection for AI API calls

### 🚀 Next Steps

After successfully running the app:

1. **Test the Assessment**: Complete a full health risk assessment
2. **Review AI Recommendations**: Check the personalized insights
3. **Explore the UI**: Navigate through all sections and features
4. **Check Responsiveness**: Test on different screen sizes

---

## 📋 Quick Reference

**Start the app:**
```bash
git clone https://github.com/av1mkhurana/disease-risk-prediction-app.git
cd disease-risk-prediction-app/frontend
npm install
npm start
```

**Access the app:**
```
http://localhost:3001
```

**Key Features:**
- 2-minute health assessment
- AI-powered recommendations
- Modern, responsive UI
- No signup required
- Privacy-focused design

---

*For detailed project information, see the memory-bank/ directory and README.md*
