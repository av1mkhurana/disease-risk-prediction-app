import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const EducationPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Health Education
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Education page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default EducationPage;
