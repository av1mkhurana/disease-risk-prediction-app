import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Security,
  Psychology,
  Timeline,
  HealthAndSafety,
  Shield,
  CheckCircle,
  AccessTime,
  TrendingUp,
  Verified,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = [
    'Welcome',
    'Privacy & Security',
    'How It Works',
    'Get Started'
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Navigate to data collection on final step
      navigate('/data-collection');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
            <Box sx={{ mb: 3 }}>
              <HealthAndSafety 
                sx={{ 
                  fontSize: { xs: 60, md: 80 }, 
                  color: 'primary.main',
                  mb: 2 
                }} 
              />
            </Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                mb: 2 
              }}
            >
              Welcome to Your Health Journey
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                lineHeight: 1.5
              }}
            >
              Take control of your health with AI-powered risk assessment that can detect potential issues years before symptoms appear.
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
              {[
                { icon: <Psychology />, text: '94% Accuracy', color: 'primary' },
                { icon: <AccessTime />, text: '10 Minutes', color: 'secondary' },
                { icon: <TrendingUp />, text: '5-10 Years Early Detection', color: 'success' },
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Chip
                    icon={item.icon}
                    label={item.text}
                    color={item.color as any}
                    variant="outlined"
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      py: 2,
                      px: 1,
                      height: 'auto',
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Alert 
              severity="info" 
              sx={{ 
                mt: 3, 
                maxWidth: 600, 
                mx: 'auto',
                textAlign: 'left'
              }}
            >
              <Typography variant="body2">
                <strong>Trusted by healthcare professionals</strong> • Used by 50+ medical institutions • 50,000+ users worldwide
              </Typography>
            </Alert>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: { xs: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Shield 
                sx={{ 
                  fontSize: { xs: 60, md: 80 }, 
                  color: 'primary.main',
                  mb: 2 
                }} 
              />
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                  mb: 2 
                }}
              >
                Your Privacy, Our Priority
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  lineHeight: 1.5
                }}
              >
                We take your health data security seriously. Here's how we protect your information.
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ maxWidth: 900, mx: 'auto' }}>
              {[
                {
                  icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
                  title: 'Bank-Level Encryption',
                  description: 'Your data is encrypted with the same technology banks use to protect financial information.'
                },
                {
                  icon: <Verified sx={{ fontSize: 40, color: 'primary.main' }} />,
                  title: 'HIPAA Compliant',
                  description: 'We follow strict healthcare privacy regulations to ensure your medical information stays confidential.'
                },
                {
                  icon: <CheckCircle sx={{ fontSize: 40, color: 'primary.main' }} />,
                  title: 'You Control Your Data',
                  description: 'We never sell your information. You decide who sees your data and can delete it anytime.'
                }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        {item.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                "Your health data is more secure with us than in most hospital systems."
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                - Dr. Sarah Chen, Chief Medical Officer
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: { xs: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Timeline 
                sx={{ 
                  fontSize: { xs: 60, md: 80 }, 
                  color: 'primary.main',
                  mb: 2 
                }} 
              />
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                  mb: 2 
                }}
              >
                How Your Assessment Works
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  lineHeight: 1.5
                }}
              >
                A simple 3-step process that takes just 10 minutes to complete.
              </Typography>
            </Box>

            <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
              {[
                {
                  step: '1',
                  title: 'Share Your Health Story',
                  description: 'Answer questions about your lifestyle, family history, and current health. All information is encrypted and secure.',
                  details: ['Demographics & lifestyle', 'Family medical history', 'Current symptoms', 'Lab results (optional)'],
                  time: '5-7 minutes'
                },
                {
                  step: '2',
                  title: 'AI Analyzes Your Risks',
                  description: 'Our advanced AI compares your profile against millions of health outcomes to identify your personal risk factors.',
                  details: ['Machine learning analysis', '94% accuracy rate', 'Millions of data points', 'Instant results'],
                  time: '30 seconds'
                },
                {
                  step: '3',
                  title: 'Get Your Action Plan',
                  description: 'Receive personalized recommendations that can reduce your disease risk by up to 80%. Track your progress over time.',
                  details: ['Personalized recommendations', 'Risk reduction strategies', 'Progress tracking', 'Regular updates'],
                  time: '2-3 minutes to review'
                }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', position: 'relative' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.step}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {item.details.map((detail, idx) => (
                          <Typography key={idx} variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                            • {detail}
                          </Typography>
                        ))}
                      </Box>
                      <Chip 
                        label={item.time} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Alert severity="success" sx={{ maxWidth: 600, mx: 'auto' }}>
                <Typography variant="body2">
                  <strong>Total time: About 10 minutes</strong> • You can save and continue later if needed
                </Typography>
              </Alert>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
            <Box sx={{ mb: 3 }}>
              <CheckCircle 
                sx={{ 
                  fontSize: { xs: 60, md: 80 }, 
                  color: 'success.main',
                  mb: 2 
                }} 
              />
            </Box>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                mb: 2 
              }}
            >
              Ready to Begin?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                lineHeight: 1.5
              }}
            >
              You're all set! Let's start your personalized health risk assessment and take the first step toward a healthier future.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                What You'll Get:
              </Typography>
              <Grid container spacing={2} sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                {[
                  'Personalized risk scores for major diseases',
                  'Evidence-based recommendations',
                  'Lifestyle modification suggestions',
                  'Progress tracking dashboard',
                  'Regular health insights'
                ].map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ textAlign: 'left' }}>
                        {benefit}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ 
              p: 3, 
              bgcolor: 'primary.light', 
              borderRadius: 2, 
              maxWidth: 500, 
              mx: 'auto',
              mb: 3
            }}>
              <Typography variant="body1" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>
                🎯 Join 50,000+ people who've taken control of their health
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Progress Stepper */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{ mb: 2 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <LinearProgress 
          variant="determinate" 
          value={(activeStep / (steps.length - 1)) * 100} 
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>

      {/* Step Content */}
      <Box sx={{ minHeight: { xs: 400, md: 500 } }}>
        {renderStepContent(activeStep)}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          {activeStep < steps.length - 1 && (
            <Button
              variant="outlined"
              onClick={() => navigate('/data-collection')}
              sx={{ minWidth: 120 }}
            >
              Skip to Assessment
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ minWidth: 120 }}
          >
            {activeStep === steps.length - 1 ? 'Start Assessment' : 'Next'}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default OnboardingPage;
