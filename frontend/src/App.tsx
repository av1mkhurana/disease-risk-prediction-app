import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import OnboardingPage from './pages/OnboardingPage.tsx';
import DataCollectionPage from './pages/DataCollectionPage.tsx';
import PredictionPage from './pages/PredictionPage.tsx';
import EducationPage from './pages/EducationPage.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import AssessmentPage from './pages/AssessmentPage.tsx';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/data-collection" element={<DataCollectionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
