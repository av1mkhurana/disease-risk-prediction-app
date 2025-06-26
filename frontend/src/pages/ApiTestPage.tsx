import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ApiTestPage: React.FC = () => {
  const { session, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApiCall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header if user is authenticated
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      console.log('Making API call with headers:', headers);
      
      const response = await fetch('http://localhost:8000/api/v1/predictions/predict', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          include_lab_results: true,
          prediction_types: ["heart_disease", "diabetes", "cancer"]
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
      console.log('API Response:', data);
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testUnauthenticatedAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing unauthenticated API endpoint...');
      
      const response = await fetch('http://localhost:8000/api/v1/predictions/test-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
      console.log('Test API Response:', data);
    } catch (err: any) {
      console.error('Test API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testBackendHealth = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/docs');
      if (response.ok) {
        setResult({ message: 'Backend is running and accessible', status: response.status });
      } else {
        throw new Error(`Backend health check failed: ${response.status}`);
      }
    } catch (err: any) {
      setError(`Backend connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        API Testing Dashboard
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Authentication Status
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>User:</strong> {user ? user.email : 'Not authenticated'}
          </Typography>
          <Typography variant="body2">
            <strong>Session:</strong> {session ? 'Active' : 'None'}
          </Typography>
          <Typography variant="body2">
            <strong>Access Token:</strong> {session?.access_token ? 'Present' : 'Missing'}
          </Typography>
        </Box>
        
        {!session && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            You need to be logged in to test the authenticated API endpoints.
            Please go to the login page first.
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          API Tests
        </Typography>
        
        <Stack spacing={2}>
          <Button
            variant="outlined"
            onClick={testBackendHealth}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={20} /> : 'Test Backend Health'}
          </Button>
          
          <Button
            variant="contained"
            onClick={testUnauthenticatedAPI}
            disabled={loading}
            fullWidth
            color="success"
          >
            {loading ? <CircularProgress size={20} /> : 'Test Groq AI Prediction (No Auth Required)'}
          </Button>
          
          <Button
            variant="contained"
            onClick={testApiCall}
            disabled={loading || !session}
            fullWidth
          >
            {loading ? <CircularProgress size={20} /> : 'Test Authenticated Prediction API'}
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Error:</strong> {error}
          </Typography>
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            API Response
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ 
            backgroundColor: '#f5f5f5', 
            p: 2, 
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflow: 'auto',
            maxHeight: 400
          }}>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default ApiTestPage;
