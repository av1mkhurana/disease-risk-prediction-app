# Disease Risk Prediction App - Deployment Guide

Complete guide to deploy this application on another computer.

## 📋 System Requirements

### Required Software
- **Python 3.8+** (recommended: Python 3.9 or 3.10)
- **Node.js 16+** (recommended: Node.js 18 LTS)
- **npm 8+** (comes with Node.js)
- **Git** (for cloning the repository)

### Optional but Recommended
- **Visual Studio Code** (for development)
- **Docker** (for containerized deployment)

## 🚀 Quick Start Deployment

### Step 1: Clone the Repository
```bash
git clone https://github.com/av1mkhurana/disease-risk-prediction-app.git
cd disease-risk-prediction-app
```

### Step 2: Set Up Backend (Python)
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 3: Set Up Frontend (Node.js)
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Go back to root directory
cd ..
```

### Step 4: Configure Environment Variables

#### Backend Environment (.env in backend/ directory)
Create `backend/.env` file with the following:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/disease_risk_db

# Supabase Configuration (Required)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Groq AI Configuration (Required for AI predictions)
GROQ_API_KEY=your_groq_api_key

# Security
SECRET_KEY=your-secret-key-change-in-production-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# CORS
ALLOWED_HOSTS=["http://localhost:3000", "http://127.0.0.1:3000"]

# Environment
ENVIRONMENT=development
DEBUG=true
```

#### Frontend Environment (.env in frontend/ directory)
Create `frontend/.env` file with the following:
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
REACT_APP_API_URL=http://localhost:8000
```

### Step 5: Set Up Supabase Database

1. **Create Supabase Account**: Go to [supabase.com](https://supabase.com) and create a free account
2. **Create New Project**: Create a new project and note down the URL and API keys
3. **Run Database Schema**: Execute the SQL in `supabase-schema.sql` in your Supabase SQL editor

### Step 6: Get Groq API Key

1. **Create Groq Account**: Go to [console.groq.com](https://console.groq.com) and create an account
2. **Generate API Key**: Create a new API key for the Llama model access
3. **Add to Environment**: Add the key to your `backend/.env` file

### Step 7: Run the Application

#### Option A: Development Mode (Recommended for testing)

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Option B: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Step 8: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Configuration Details

### Required API Keys and Services

#### 1. Supabase Setup
- **Purpose**: Database, authentication, and data storage
- **Cost**: Free tier available (up to 50MB database)
- **Setup**: 
  1. Create account at supabase.com
  2. Create new project
  3. Copy URL and API keys to environment files
  4. Run the database schema from `supabase-schema.sql`

#### 2. Groq AI Setup
- **Purpose**: AI-powered disease risk predictions using Llama-4
- **Cost**: Free tier available (limited requests per day)
- **Setup**:
  1. Create account at console.groq.com
  2. Generate API key
  3. Add to `GROQ_API_KEY` in backend/.env

### Database Schema
The application uses the following main tables:
- `user_profiles` - User demographic and health data
- `risk_predictions` - AI-generated risk assessments
- `lab_results` - User-uploaded lab test results
- Authentication handled by Supabase Auth

## 🐳 Docker Deployment

### Using Docker Compose (Easiest)
```bash
# Clone repository
git clone https://github.com/av1mkhurana/disease-risk-prediction-app.git
cd disease-risk-prediction-app

# Set up environment variables (create .env files as described above)

# Build and run
docker-compose up --build

# Access application at http://localhost:3000
```

### Manual Docker Build
```bash
# Build backend
cd backend
docker build -t disease-risk-backend .

# Build frontend
cd ../frontend
docker build -t disease-risk-frontend .

# Run containers
docker run -p 8000:8000 disease-risk-backend
docker run -p 3000:3000 disease-risk-frontend
```

## 🌐 Production Deployment

### Environment Variables for Production
Update the following for production:
```env
# Backend
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=generate-a-strong-random-secret-key
ALLOWED_HOSTS=["https://yourdomain.com"]

# Frontend
REACT_APP_API_URL=https://your-backend-domain.com
```

### Recommended Hosting Platforms

#### Frontend (React App)
- **Vercel** (recommended) - Easy deployment with GitHub integration
- **Netlify** - Simple static site hosting
- **AWS S3 + CloudFront** - Scalable solution

#### Backend (FastAPI)
- **Railway** (recommended) - Easy Python app deployment
- **Heroku** - Popular platform-as-a-service
- **AWS EC2** - Full control over server
- **DigitalOcean App Platform** - Simple cloud hosting

### Build for Production
```bash
# Frontend production build
cd frontend
npm run build

# Backend is ready for production with uvicorn
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Python Dependencies
```bash
# If pip install fails, try upgrading pip
python -m pip install --upgrade pip

# For Windows users with compilation errors
pip install --only-binary=all psycopg2-binary
```

#### 2. Node.js Dependencies
```bash
# Clear npm cache if installation fails
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Environment Variables
- Ensure all required environment variables are set
- Check for typos in variable names
- Verify API keys are valid and active

#### 4. CORS Issues
- Ensure backend ALLOWED_HOSTS includes frontend URL
- Check that frontend is making requests to correct backend URL

#### 5. Database Connection
- Verify Supabase URL and keys are correct
- Ensure database schema has been applied
- Check Supabase project is active

### Testing the Deployment

#### 1. Backend Health Check
```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy"}
```

#### 2. Frontend Access
- Navigate to http://localhost:3000
- Should see the Disease Risk Prediction App homepage

#### 3. API Integration
- Try creating an account and logging in
- Test the health assessment flow
- Verify predictions are generated

## 📚 Additional Resources

### Documentation Files
- `README.md` - Project overview and basic setup
- `QUICK_START.md` - Simplified setup instructions
- `SUPABASE_SETUP.md` - Detailed Supabase configuration
- `requirements.txt` - Complete dependency list

### Support
- Check the GitHub repository for issues and updates
- Review the API documentation at `/docs` endpoint
- Ensure all environment variables are properly configured

## 🔒 Security Notes

### For Production Deployment
1. **Change default secrets** - Generate strong, unique secret keys
2. **Use HTTPS** - Enable SSL/TLS for all communications
3. **Environment variables** - Never commit API keys to version control
4. **Database security** - Use strong passwords and restrict access
5. **CORS configuration** - Limit allowed origins to your domain only

### API Key Security
- Store API keys in environment variables only
- Use different keys for development and production
- Regularly rotate API keys
- Monitor API usage for unusual activity

---

## ✅ Deployment Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Repository cloned
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Node.js dependencies installed (`npm install`)
- [ ] Supabase account created and configured
- [ ] Groq API key obtained and configured
- [ ] Backend `.env` file created with all required variables
- [ ] Frontend `.env` file created with all required variables
- [ ] Database schema applied in Supabase
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Application accessible and functional

**🎉 Your Disease Risk Prediction App should now be fully deployed and operational!**
