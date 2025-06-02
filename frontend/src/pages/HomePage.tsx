import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import {
  Security,
  Analytics,
  HealthAndSafety,
  School,
  TrendingUp,
  Shield,
  Psychology,
  Timeline,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'AI That Understands You',
      description: 'Our machine learning models are trained on millions of health profiles to understand your unique risk factors and provide insights tailored specifically to you.',
      benefit: 'Personalized predictions with high accuracy'
    },
    {
      icon: <Shield sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Your Privacy, Our Priority',
      description: 'Bank-level encryption protects your health data. We never sell your information, and you control who sees what.',
      benefit: 'HIPAA compliant & fully encrypted'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Early Detection Saves Lives',
      description: 'Identify potential health risks 5-10 years before symptoms appear. Early intervention can reduce disease risk by up to 80%.',
      benefit: 'Prevent rather than treat'
    },
    {
      icon: <Timeline sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Track Your Progress',
      description: 'Monitor how lifestyle changes impact your risk scores over time. See the real impact of your health decisions.',
      benefit: 'Measurable health improvements'
    },
  ];

  const stats = [
    { number: 'AI', label: 'Powered Analysis' },
    { number: '2min', label: 'Quick Assessment' },
    { number: '15+', label: 'Risk Factors' },
    { number: '5-10', label: 'Years Early Detection' },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          color: 'white',
          mb: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Chip 
            label="🚀 Early Access - AI-Powered Health Insights" 
            sx={{ 
              mb: 3, 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
          <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Know Your Health Risks<br />Before They Know You
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
            AI-powered early detection for a healthier tomorrow
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 700, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Prevention is better than cure. Our advanced AI analyzes your unique health profile to identify potential risks 
            <strong> years before symptoms appear</strong>. Take the first step toward proactive health management with 
            personalized insights you can trust.
          </Typography>
          
          {/* Stats Row */}
          <Grid container spacing={3} sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/assessment')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Free Assessment Now
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Trust Indicators */}
      <Alert 
        severity="info" 
        sx={{ mb: 6, textAlign: 'center' }}
        icon={<Security />}
      >
        <Typography variant="body2">
          <strong>Built for healthcare professionals</strong> • Privacy-focused design • Secure data handling • 
          Research-backed AI models
        </Typography>
      </Alert>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Why Choose Our AI Health Platform
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto', fontSize: '1.1rem' }}
        >
          We're not just another health app. We're your early warning system, built to improve health outcomes and 
          powered by cutting-edge AI technology for personalized health insights.
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                  <Chip 
                    label={feature.benefit} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your Health Journey in 3 Simple Steps
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          Getting started takes just 2 minutes. Our AI does the heavy lifting while you focus on living healthier.
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, position: 'relative' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                1
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Share Your Health Story
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Answer questions about your lifestyle, family history, and current health. 
                Takes 2 minutes, protects you for life.
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}>
                ⏱️ 2 minutes • 🔒 Fully encrypted
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, position: 'relative' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                2
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                AI Analyzes Your Risks
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Our AI compares your profile against millions of health outcomes to identify 
                your personal risk factors with high accuracy.
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}>
                🤖 AI-powered • 📊 High accuracy
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, position: 'relative' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                3
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Get Your Action Plan
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Receive personalized recommendations that can reduce your disease risk by up to 80%. 
                Track progress over time.
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}>
                📈 Track progress • 🎯 Reduce risk 80%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 8, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 4, p: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Our Mission: Preventive Healthcare for Everyone
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
          We believe everyone deserves access to advanced health insights. Our AI technology makes 
          sophisticated risk assessment accessible, helping you make informed decisions about your health 
          before problems develop.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Early detection. Better outcomes. Healthier lives.
          </Typography>
        </Box>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your Future Self Will Thank You
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, maxWidth: 500, mx: 'auto' }}>
          Don't wait for symptoms. Take 2 minutes today to understand your health risks and 
          get a personalized plan to prevent disease.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/assessment')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Start Free Assessment Now
          </Button>
          <Typography variant="caption" sx={{ alignSelf: 'center', opacity: 0.8 }}>
            Free • No credit card required • No signup needed
          </Typography>
        </Stack>
      </Box>

      {/* Disclaimer */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          <strong>Medical Disclaimer:</strong> This application provides health insights for educational purposes. 
          It does not replace professional medical advice, diagnosis, or treatment. 
          Always consult qualified healthcare providers for medical decisions. Our AI predictions are based on 
          statistical models and should be used as one factor in your health planning.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
