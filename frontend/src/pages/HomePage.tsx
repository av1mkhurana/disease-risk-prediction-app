import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Security,
  TrendingUp,
  Shield,
  Psychology,
  Timeline,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Psychology sx={{ fontSize: { xs: 40, md: 48 }, color: 'primary.main' }} />,
      title: 'AI That Understands You',
      description: 'Our machine learning models are trained on millions of health profiles to understand your unique risk factors and provide insights tailored specifically to you.',
      benefit: 'Personalized predictions with 94% accuracy'
    },
    {
      icon: <Shield sx={{ fontSize: { xs: 40, md: 48 }, color: 'primary.main' }} />,
      title: 'Your Privacy, Our Priority',
      description: 'Bank-level encryption protects your health data. We never sell your information, and you control who sees what.',
      benefit: 'HIPAA compliant & fully encrypted'
    },
    {
      icon: <TrendingUp sx={{ fontSize: { xs: 40, md: 48 }, color: 'primary.main' }} />,
      title: 'Early Detection Saves Lives',
      description: 'Identify potential health risks 5-10 years before symptoms appear. Early intervention can reduce disease risk by up to 80%.',
      benefit: 'Prevent rather than treat'
    },
    {
      icon: <Timeline sx={{ fontSize: { xs: 40, md: 48 }, color: 'primary.main' }} />,
      title: 'Track Your Progress',
      description: 'Monitor how lifestyle changes impact your risk scores over time. See the real impact of your health decisions.',
      benefit: 'Measurable health improvements'
    },
  ];

  const stats = [
    { number: '94%', label: 'Prediction Accuracy' },
    { number: '50K+', label: 'Lives Improved' },
    { number: '15+', label: 'Disease Types' },
    { number: '5-10', label: 'Years Early Detection' },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: { xs: 2, md: 4 },
          color: 'white',
          mb: { xs: 4, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Chip 
            label="🚀 Early Access - Join 50,000+ Users" 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
            }} 
          />
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
              lineHeight: { xs: 1.2, md: 1.1 },
              mb: { xs: 2, md: 3 },
            }}
          >
            Know Your Health Risks<br />Before They Know You
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              mb: { xs: 3, md: 4 }, 
              opacity: 0.9, 
              fontWeight: 300,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              lineHeight: 1.3,
            }}
          >
            AI-powered early detection for a healthier tomorrow
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: { xs: 3, md: 4 }, 
              maxWidth: { xs: '100%', sm: 600, md: 700 }, 
              mx: 'auto', 
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }, 
              lineHeight: { xs: 1.5, md: 1.6 },
              px: { xs: 1, sm: 0 },
            }}
          >
            Prevention is better than cure. Our advanced AI analyzes your unique health profile to identify potential risks 
            <strong> years before symptoms appear</strong>. Take the first step toward proactive health management with 
            personalized insights you can trust.
          </Typography>
          
          {/* Stats Row */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 }, maxWidth: { xs: '100%', md: 600 }, mx: 'auto' }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.8,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      display: 'block',
                    }}
                  >
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
              onClick={() => navigate('/onboarding')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 'bold',
                minHeight: { xs: 44, sm: 48 },
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: 280, sm: 'none' },
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Free Assessment
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Trust Indicators */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: { xs: 4, md: 6 }, 
          textAlign: 'center',
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
        icon={<Security />}
      >
        <Typography 
          variant="body2"
          sx={{
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            lineHeight: 1.4,
          }}
        >
          <strong>Trusted by healthcare professionals</strong> • HIPAA Compliant • Bank-level encryption • 
          Used by 50+ medical institutions worldwide
        </Typography>
      </Alert>

      {/* Features Section */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography 
          variant="h2" 
          component="h2" 
          textAlign="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
            lineHeight: 1.2,
            mb: { xs: 2, md: 3 },
          }}
        >
          Why 50,000+ People Trust Us With Their Health
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ 
            mb: { xs: 4, md: 6 }, 
            maxWidth: { xs: '100%', md: 800 }, 
            mx: 'auto', 
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
            lineHeight: 1.6,
            px: { xs: 1, sm: 0 },
          }}
        >
          We're not just another health app. We're your early warning system, built by medical experts and 
          powered by AI that learns from millions of health outcomes.
        </Typography>
        
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: { xs: 2, sm: 3 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-8px)' },
                    boxShadow: { xs: 1, md: 4 },
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: { xs: 1.5, md: 2 }, 
                      lineHeight: 1.6,
                      fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Chip 
                    label={feature.benefit} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      height: { xs: 24, sm: 32 },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
            lineHeight: 1.2,
            mb: { xs: 2, md: 3 },
          }}
        >
          Your Health Journey in 3 Simple Steps
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 4, md: 6 }, 
            maxWidth: { xs: '100%', md: 600 }, 
            mx: 'auto',
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.6,
            px: { xs: 1, sm: 0 },
          }}
        >
          Getting started takes just 10 minutes. Our AI does the heavy lifting while you focus on living healthier.
        </Typography>
        
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: { xs: 2, md: 4 } }}>
          {[
            {
              number: '1',
              title: 'Share Your Health Story',
              description: 'Answer questions about your lifestyle, family history, and current health. Takes 10 minutes, protects you for life.',
              caption: '⏱️ 10 minutes • 🔒 Fully encrypted'
            },
            {
              number: '2',
              title: 'AI Analyzes Your Risks',
              description: 'Our AI compares your profile against millions of health outcomes to identify your personal risk factors with 94% accuracy.',
              caption: '🤖 AI-powered • 📊 94% accuracy'
            },
            {
              number: '3',
              title: 'Get Your Action Plan',
              description: 'Receive personalized recommendations that can reduce your disease risk by up to 80%. Track progress over time.',
              caption: '📈 Track progress • 🎯 Reduce risk 80%'
            }
          ].map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative' }}>
                <Box
                  sx={{
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                    fontWeight: 'bold',
                  }}
                >
                  {step.number}
                </Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    lineHeight: 1.6,
                    mb: { xs: 1, md: 1.5 },
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  }}
                >
                  {step.description}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="primary.main" 
                  sx={{ 
                    mt: 1, 
                    display: 'block', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                >
                  {step.caption}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Social Proof Section */}
      <Box 
        sx={{ 
          mb: { xs: 6, md: 8 }, 
          textAlign: 'center', 
          bgcolor: 'grey.50', 
          borderRadius: { xs: 2, md: 4 }, 
          p: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            lineHeight: 1.2,
          }}
        >
          "This App Saved My Life"
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: { xs: 2, md: 3 }, 
            fontStyle: 'italic', 
            maxWidth: { xs: '100%', md: 600 }, 
            mx: 'auto',
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.6,
          }}
        >
          "The AI detected my diabetes risk 3 years before my doctor did. I made lifestyle changes and 
          my latest tests show I'm no longer pre-diabetic. I can't thank this app enough."
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          - Sarah M., Teacher, Age 34
        </Typography>
        <Box sx={{ mt: { xs: 3, md: 4 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Join 50,000+ people who've taken control of their health
          </Typography>
        </Box>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 4, sm: 5, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: { xs: 2, md: 4 },
          mb: { xs: 3, md: 4 },
          color: 'white',
        }}
      >
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            lineHeight: 1.2,
          }}
        >
          Your Future Self Will Thank You
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: { xs: 3, md: 4 }, 
            opacity: 0.9, 
            maxWidth: { xs: '100%', md: 500 }, 
            mx: 'auto',
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.6,
          }}
        >
          Don't wait for symptoms. Take 10 minutes today to understand your health risks and 
          get a personalized plan to prevent disease.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/onboarding')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: { xs: 3, sm: 4 },
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 'bold',
              minHeight: { xs: 44, sm: 48 },
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: 280, sm: 'none' },
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Start Free Assessment Now
          </Button>
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.8,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              textAlign: 'center',
            }}
          >
            Free • No credit card required • 2 minutes to sign up
          </Typography>
        </Box>
      </Box>

      {/* Disclaimer */}
      <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            lineHeight: 1.5,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            display: 'block',
            maxWidth: { xs: '100%', md: 800 },
            mx: 'auto',
          }}
        >
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
