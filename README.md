# Disease Risk Prediction App

A comprehensive web-based application that uses machine learning to assess personalized disease risks and provide actionable health recommendations.

## Features

- **Secure User Onboarding**: Guided setup with privacy-first approach
- **Comprehensive Data Collection**: Demographics, lifestyle, medical history, and lab results
- **AI-Powered Risk Assessment**: Machine learning models for personalized disease risk prediction
- **Interactive Dashboard**: Visual risk overview with trends and history
- **Educational Content**: Evidence-based health information and prevention strategies
- **Privacy & Security**: End-to-end encryption and transparent data handling

## Technology Stack

### Frontend
- React 18 with TypeScript
- Material-UI for consistent design
- Chart.js for data visualizations
- React Router for navigation

### Backend
- FastAPI (Python) for high-performance API
- SQLAlchemy ORM with PostgreSQL
- JWT authentication
- Scikit-learn for ML models

### Security
- Field-level encryption for sensitive data
- HTTPS/TLS encryption
- GDPR-compliant data handling
- Secure session management

## Project Structure

```
disease-risk-app/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── services/        # API communication
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript definitions
│   ├── public/
│   └── package.json
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Configuration & security
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   └── ml/              # ML prediction engine
│   ├── tests/
│   └── requirements.txt
├── ml-models/               # Machine learning components
│   ├── training/            # Model training scripts
│   ├── models/              # Trained model files
│   └── data/                # Sample datasets
├── docs/                    # Documentation
└── docker-compose.yml       # Development environment
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 13+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd disease-risk-app
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Configure environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

5. Run the application:
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm start
```

### Using Docker

```bash
docker-compose up --build
```

## Development

### Backend Development
- API documentation available at `http://localhost:8000/docs`
- Run tests: `pytest`
- Code formatting: `black app/`
- Linting: `flake8 app/`

### Frontend Development
- Development server: `npm start`
- Run tests: `npm test`
- Build for production: `npm run build`
- Type checking: `npm run type-check`

## Security & Privacy

This application handles sensitive health data and implements:
- End-to-end encryption for all personal health information
- Zero-knowledge architecture where possible
- GDPR compliance with data portability and deletion rights
- Regular security audits and penetration testing
- Transparent privacy policy and data usage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions about medical conditions.
