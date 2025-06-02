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
} from '@mui/material';
import { Security, HealthAndSafety, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log('Login attempt:', { email, password });
  };

  const handleDemoLogin = () => {
    setEmail('demo@healthrisk.ai');
    setPassword('demo123');
    setShowDemo(true);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome Back to Your Health Journey
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
            Continue monitoring your health risks and tracking your progress toward a healthier future.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* Login Form */}
          <Card sx={{ flex: 1, maxWidth: 400 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Sign In
              </Typography>
              
              {showDemo && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <strong>Demo Mode:</strong> You're using demo credentials. In the real app, this would log you into your personal health dashboard.
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
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  Access My Health Dashboard
                </Button>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {/* TODO: Implement forgot password */}}
                    sx={{ textDecoration: 'none' }}
                  >
                    Forgot your password?
                  </Link>
                </Box>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleDemoLogin}
                  sx={{ mb: 2 }}
                >
                  Try Demo Account
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component="button"
                      onClick={() => navigate('/register')}
                      sx={{ fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      Start your free assessment
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Benefits Sidebar */}
          <Box sx={{ flex: 1, maxWidth: 350 }}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🎯 Your Health Progress Awaits
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  See how your lifestyle changes are impacting your disease risk scores and get updated recommendations.
                </Typography>
              </CardContent>
            </Card>

            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Security color="primary" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Your Data is Safe
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bank-level encryption protects all your health information
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TrendingUp color="primary" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Track Your Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    See how your risk scores change as you implement our recommendations
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <HealthAndSafety color="primary" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Updated Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get new health insights as our AI learns from the latest medical research
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                <strong>Quick Tip:</strong> Regular check-ins help our AI provide more accurate predictions. 
                We recommend updating your profile every 3-6 months.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Trust Indicators */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Trusted by healthcare professionals worldwide
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Chip label="HIPAA Compliant" size="small" variant="outlined" />
            <Chip label="256-bit Encryption" size="small" variant="outlined" />
            <Chip label="SOC 2 Certified" size="small" variant="outlined" />
            <Chip label="50+ Medical Institutions" size="small" variant="outlined" />
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
