import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Registration page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
