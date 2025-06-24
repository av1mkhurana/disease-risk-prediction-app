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
} from '@mui/material';
import { Security, HealthAndSafety, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message || 'Login failed');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@healthrisk.ai');
    setPassword('demo123456');
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn('demo@healthrisk.ai', 'demo123456');
      if (error) {
        setError('Demo account not available. Please create a new account.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Demo login failed. Please try creating a new account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    // TODO: Implement password reset
    setError('Password reset functionality will be available soon');
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
            Welcome Back to Your Health Journey
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
            Continue monitoring your health risks and tracking your progress toward a healthier future.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 }, 
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'center',
        }}>
          {/* Login Form */}
          <Card sx={{ 
            flex: 1, 
            maxWidth: { xs: '100%', md: 400 },
            width: { xs: '100%', md: 'auto' },
            order: { xs: 1, md: 1 },
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  textAlign: 'center',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Sign In
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {error}
                  </Typography>
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={loading}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '1rem' },
                    },
                  }}
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
                  {loading ? 'Signing In...' : 'Access My Health Dashboard'}
                </Button>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    sx={{ 
                      textDecoration: 'none',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>

                <Divider sx={{ my: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    OR
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  sx={{ 
                    mb: 2,
                    py: { xs: 1, sm: 1.2 },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    minHeight: { xs: 40, sm: 44 },
                  }}
                >
                  {loading ? 'Loading Demo...' : 'Try Demo Account'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Don't have an account?{' '}
                    <Link
                      component="button"
                      onClick={() => navigate('/register')}
                      disabled={loading}
                      sx={{ 
                        fontWeight: 'bold', 
                        textDecoration: 'none',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      }}
                    >
                      Start your free assessment
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
              bgcolor: 'primary.main', 
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
                  🎯 Your Health Progress Awaits
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    lineHeight: 1.5,
                  }}
                >
                  See how your lifestyle changes are impacting your disease risk scores and get updated recommendations.
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
                    Your Data is Safe
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Bank-level encryption protects all your health information
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
                    Track Your Progress
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    See how your risk scores change as you implement our recommendations
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
                    Updated Insights
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Get new health insights as our AI learns from the latest medical research
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Box sx={{ 
              mt: { xs: 3, md: 4 }, 
              p: { xs: 2, sm: 3 }, 
              bgcolor: 'grey.50', 
              borderRadius: 2 
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  textAlign: 'center',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  lineHeight: 1.5,
                }}
              >
                <strong>Quick Tip:</strong> Regular check-ins help our AI provide more accurate predictions. 
                We recommend updating your profile every 3-6 months.
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
            Trusted by healthcare professionals worldwide
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center" 
            flexWrap="wrap"
            sx={{ gap: { xs: 1, sm: 2 } }}
          >
            <Chip 
              label="HIPAA Compliant" 
              size="small" 
              variant="outlined" 
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
            <Chip 
              label="256-bit Encryption" 
              size="small" 
              variant="outlined" 
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
            <Chip 
              label="SOC 2 Certified" 
              size="small" 
              variant="outlined" 
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
            <Chip 
              label="50+ Medical Institutions" 
              size="small" 
              variant="outlined" 
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
