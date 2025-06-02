import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Privacy policy page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPage;
