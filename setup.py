#!/usr/bin/env python3
"""
Disease Risk Prediction App - Quick Setup Script
Automates the setup process for deploying on another computer
"""

import os
import sys
import subprocess
import platform

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_requirements():
    """Check if required software is installed"""
    print("🔍 Checking system requirements...")
    
    # Check Python
    try:
        python_version = sys.version_info
        if python_version.major >= 3 and python_version.minor >= 8:
            print(f"✅ Python {python_version.major}.{python_version.minor} is installed")
        else:
            print(f"❌ Python 3.8+ required, found {python_version.major}.{python_version.minor}")
            return False
    except:
        print("❌ Python not found")
        return False
    
    # Check Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Node.js {version} is installed")
        else:
            print("❌ Node.js not found")
            return False
    except:
        print("❌ Node.js not found")
        return False
    
    # Check npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ npm {version} is installed")
        else:
            print("❌ npm not found")
            return False
    except:
        print("❌ npm not found")
        return False
    
    return True

def setup_backend():
    """Set up the backend Python environment"""
    print("\n🐍 Setting up backend (Python)...")
    
    # Create virtual environment
    if not run_command("python -m venv venv", "Creating virtual environment"):
        return False
    
    # Activate virtual environment and install dependencies
    if platform.system() == "Windows":
        activate_cmd = "venv\\Scripts\\activate && pip install -r requirements.txt"
    else:
        activate_cmd = "source venv/bin/activate && pip install -r requirements.txt"
    
    if not run_command(activate_cmd, "Installing Python dependencies"):
        return False
    
    return True

def setup_frontend():
    """Set up the frontend Node.js environment"""
    print("\n⚛️ Setting up frontend (React)...")
    
    # Change to frontend directory and install dependencies
    if not run_command("cd frontend && npm install", "Installing Node.js dependencies"):
        return False
    
    return True

def create_env_templates():
    """Create environment variable template files"""
    print("\n📝 Creating environment variable templates...")
    
    # Backend .env template
    backend_env_template = """# Database Configuration
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
"""
    
    # Frontend .env template
    frontend_env_template = """# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
REACT_APP_API_URL=http://localhost:8000
"""
    
    # Create backend .env template if it doesn't exist
    backend_env_path = "backend/.env.template"
    if not os.path.exists(backend_env_path):
        with open(backend_env_path, 'w') as f:
            f.write(backend_env_template)
        print(f"✅ Created {backend_env_path}")
    
    # Create frontend .env template if it doesn't exist
    frontend_env_path = "frontend/.env.template"
    if not os.path.exists(frontend_env_path):
        with open(frontend_env_path, 'w') as f:
            f.write(frontend_env_template)
        print(f"✅ Created {frontend_env_path}")
    
    return True

def main():
    """Main setup function"""
    print("🏥 Disease Risk Prediction App - Quick Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("requirements.txt") or not os.path.exists("frontend/package.json"):
        print("❌ Please run this script from the root directory of the project")
        print("   Make sure you have cloned the repository and are in the correct folder")
        sys.exit(1)
    
    # Check system requirements
    if not check_requirements():
        print("\n❌ System requirements not met. Please install the required software:")
        print("   - Python 3.8+ (https://python.org)")
        print("   - Node.js 16+ (https://nodejs.org)")
        sys.exit(1)
    
    # Set up backend
    if not setup_backend():
        print("\n❌ Backend setup failed. Please check the error messages above.")
        sys.exit(1)
    
    # Set up frontend
    if not setup_frontend():
        print("\n❌ Frontend setup failed. Please check the error messages above.")
        sys.exit(1)
    
    # Create environment templates
    create_env_templates()
    
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Configure environment variables:")
    print("   - Copy backend/.env.template to backend/.env and fill in your API keys")
    print("   - Copy frontend/.env.template to frontend/.env and fill in your configuration")
    print("\n2. Set up external services:")
    print("   - Create Supabase account and project (https://supabase.com)")
    print("   - Get Groq API key (https://console.groq.com)")
    print("   - Run database schema from supabase-schema.sql")
    print("\n3. Start the application:")
    print("   Backend:  cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    print("   Frontend: cd frontend && npm start")
    print("\n4. Access the application:")
    print("   Frontend: http://localhost:3000")
    print("   Backend:  http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    print("\n📖 For detailed instructions, see DEPLOYMENT_GUIDE.md")

if __name__ == "__main__":
    main()
