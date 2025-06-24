import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Alert,
  Divider,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Security, HealthAndSafety, TrendingUp, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) {
        setError(error.message || 'Registration failed');
      } else {
        setSuccess(true);
        // Don't navigate immediately - let user see success message
        setTimeout(() => {
          navigate('/onboarding');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            Start Your Health Journey Today
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: { xs: '100%', md: 500 }, 
              mx: 'auto',
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6,
              px: { xs: 1, sm: 0 },
            }}
          >
            Get personalized disease risk predictions and evidence-based recommendations to improve your health.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 }, 
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'center',
        }}>
          {/* Registration Form */}
          <Card sx={{ 
            flex: 1, 
            maxWidth: { xs: '100%', md: 450 },
            width: { xs: '100%', md: 'auto' },
            order: { xs: 1, md: 1 },
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <PersonAdd color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}
                >
                  Create Account
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {error}
                  </Typography>
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Account created successfully! Please check your email to verify your account. Redirecting to onboarding...
                  </Typography>
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  disabled={loading}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '1rem' },
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  disabled={loading}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '1rem' },
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  disabled={loading}
                  helperText="Must be at least 6 characters long"
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '1rem' },
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  disabled={loading}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '1rem' },
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      I agree to the{' '}
                      <Link href="/privacy" target="_blank" sx={{ textDecoration: 'none' }}>
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" target="_blank" sx={{ textDecoration: 'none' }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{ mt: 2, mb: 1, alignItems: 'flex-start' }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    py: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 'bold',
                    minHeight: { xs: 44, sm: 48 },
                  }}
                >
                  {loading ? 'Creating Account...' : 'Start My Free Health Assessment'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Already have an account?{' '}
                    <Link
                      component="button"
                      onClick={() => navigate('/login')}
                      disabled={loading}
                      sx={{ 
                        fontWeight: 'bold', 
                        textDecoration: 'none',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Benefits Sidebar */}
          <Box sx={{ 
            flex: 1, 
            maxWidth: { xs: '100%', md: 350 },
            width: { xs: '100%', md: 'auto' },
            order: { xs: 2, md: 2 },
          }}>
            <Card sx={{ 
              bgcolor: 'success.main', 
              color: 'white', 
              mb: 3,
              p: { xs: 2, sm: 3 },
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  }}
                >
                  🚀 What You'll Get
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    lineHeight: 1.5,
                  }}
                >
                  Personalized disease risk predictions, actionable health recommendations, and progress tracking - all free.
                </Typography>
              </CardContent>
            </Card>

            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Security color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    100% Free & Secure
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    No hidden fees. Your health data is encrypted and never shared.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TrendingUp color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Evidence-Based Predictions
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    AI models trained on validated clinical studies and real health data
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <HealthAndSafety color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Personalized Recommendations
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Get specific actions you can take to reduce your disease risks
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Box sx={{ 
              mt: { xs: 3, md: 4 }, 
              p: { xs: 2, sm: 3 }, 
              bgcolor: 'info.light', 
              borderRadius: 2,
              color: 'info.contrastText'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  lineHeight: 1.5,
                  fontWeight: 'medium'
                }}
              >
                ⏱️ <strong>Quick Start:</strong> Complete your health assessment in just 5-10 minutes 
                and get your personalized risk report instantly.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Trust Indicators */}
        <Box sx={{ mt: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            Join thousands of users taking control of their health
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center" 
            flexWrap="wrap"
            sx={{ gap: { xs: 1, sm: 2 } }}
          >
            <Chip 
              label="✓ No Credit Card Required" 
              size="small" 
              variant="outlined" 
              color="success"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
            <Chip 
              label="✓ Instant Results" 
              size="small" 
              variant="outlined" 
              color="success"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
            <Chip 
              label="✓ Privacy Protected" 
              size="small" 
              variant="outlined" 
              color="success"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
            <Chip 
              label="✓ Medically Validated" 
              size="small" 
              variant="outlined" 
              color="success"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
