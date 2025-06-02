import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DataCollectionPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Collection
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Data collection page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default DataCollectionPage;
