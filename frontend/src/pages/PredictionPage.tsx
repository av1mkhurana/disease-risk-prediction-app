import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PredictionPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Risk Predictions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Prediction page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default PredictionPage;
