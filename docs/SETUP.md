# Disease Risk Prediction App - Setup Guide

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Node.js** (v18 or higher) and npm
- **Python** (v3.9 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**
- **Docker** and **Docker Compose** (optional, for containerized setup)

## Quick Start with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/av1mkhurana/disease-risk-prediction-app.git
   cd disease-risk-prediction-app
   ```

2. **Start the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Manual Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Set up PostgreSQL database:**
   ```sql
   CREATE DATABASE disease_risk_db;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE disease_risk_db TO postgres;
   ```

6. **Run database migrations:**
   ```bash
   # TODO: Add Alembic migration commands when implemented
   ```

7. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env file if needed
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

### Machine Learning Models

1. **Navigate to ml-models directory:**
   ```bash
   cd ml-models
   mkdir models data training
   ```

2. **Train initial models:**
   ```bash
   cd ../backend
   python -c "from app.ml.risk_predictor import risk_predictor; risk_predictor.train_models()"
   ```

## Environment Configuration

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/disease_risk_db

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# CORS
ALLOWED_HOSTS=http://localhost:3000,http://127.0.0.1:3000

# ML Models
MODEL_PATH=ml-models/models

# Encryption
ENCRYPTION_KEY=your-32-byte-encryption-key

# Environment
ENVIRONMENT=development
DEBUG=true
```

### Frontend Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:8000
```

## Development Workflow

### Backend Development

1. **Code formatting:**
   ```bash
   black app/
   ```

2. **Linting:**
   ```bash
   flake8 app/
   ```

3. **Running tests:**
   ```bash
   pytest
   ```

4. **API Documentation:**
   - Visit http://localhost:8000/docs for interactive API documentation
   - Visit http://localhost:8000/redoc for alternative documentation

### Frontend Development

1. **Type checking:**
   ```bash
   npm run type-check
   ```

2. **Running tests:**
   ```bash
   npm test
   ```

3. **Building for production:**
   ```bash
   npm run build
   ```

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User authentication and basic profile
- `user_profiles` - Extended health profile information (encrypted)
- `lab_results` - Laboratory test results (encrypted)
- `risk_predictions` - Disease risk predictions and recommendations

## Security Considerations

1. **Data Encryption:** All sensitive health data is encrypted at the field level
2. **Authentication:** JWT-based authentication with secure token handling
3. **CORS:** Properly configured for frontend-backend communication
4. **Environment Variables:** Sensitive configuration stored in environment variables
5. **HTTPS:** Use HTTPS in production environments

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Verify database credentials

2. **Frontend Build Errors:**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Backend Import Errors:**
   - Ensure virtual environment is activated
   - Verify all dependencies are installed: `pip install -r requirements.txt`

4. **ML Model Training Issues:**
   - Ensure sufficient disk space for model files
   - Check Python dependencies for scikit-learn

### Getting Help

- Check the [GitHub Issues](https://github.com/av1mkhurana/disease-risk-prediction-app/issues)
- Review the API documentation at `/docs`
- Ensure all prerequisites are properly installed

## Production Deployment

For production deployment, consider:

1. **Environment Variables:** Use secure, production-specific values
2. **Database:** Use managed PostgreSQL service
3. **SSL/TLS:** Enable HTTPS with proper certificates
4. **Monitoring:** Implement logging and monitoring solutions
5. **Backup:** Set up regular database backups
6. **Scaling:** Consider load balancing for high traffic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
