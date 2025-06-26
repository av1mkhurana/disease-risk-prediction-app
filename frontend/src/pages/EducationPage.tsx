import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ExpandMore,
  Science,
  Psychology,
  Assessment,
  Security,
  Favorite,
  LocalHospital,
  TrendingUp,
  Analytics,
  Biotech,
  Info,
  CheckCircle,
} from '@mui/icons-material';

const EducationPage: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>('overview');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Medical Risk Assessment Framework
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Understanding the Science Behind Your Health Predictions
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Science />} label="Evidence-Based Medicine" color="primary" />
            <Chip icon={<Psychology />} label="AI-Powered Analysis" color="secondary" />
            <Chip icon={<Assessment />} label="Clinical Validation" color="success" />
          </Box>
        </Box>

        {/* Overview Alert */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            <strong>Medical Disclaimer:</strong> This educational content explains the scientific methodology behind our risk assessment system. 
            All predictions are for educational purposes only and should not replace professional medical advice. Always consult qualified healthcare providers for medical decisions.
          </Typography>
        </Alert>

        {/* Main Content Accordions */}
        <Box sx={{ mb: 4 }}>
          
          {/* System Overview */}
          <Accordion expanded={expanded === 'overview'} onChange={handleChange('overview')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Analytics color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  System Overview: Hybrid AI-Medical Framework
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Biotech color="primary" />
                        Evidence-Based Medical Algorithms
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Our system combines three validated clinical risk calculators:
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><Favorite sx={{ color: '#e91e63' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Framingham Risk Score (2008)" 
                            secondary="10-year cardiovascular disease risk prediction"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocalHospital sx={{ color: '#2196f3' }} /></ListItemIcon>
                          <ListItemText 
                            primary="ADA Diabetes Risk Calculator" 
                            secondary="Type 2 diabetes risk assessment"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Security sx={{ color: '#ff9800' }} /></ListItemIcon>
                          <ListItemText 
                            primary="NCI Cancer Risk Models" 
                            secondary="Overall cancer risk evaluation"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Psychology color="secondary" />
                        Llama-4 AI Enhancement
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Meta's Llama-4 Scout model provides:
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><CheckCircle sx={{ color: 'success.main' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Personalized Risk Interpretation" 
                            secondary="Context-aware analysis of your unique profile"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CheckCircle sx={{ color: 'success.main' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Comprehensive Health Reasoning" 
                            secondary="Detailed explanations of risk factors and scores"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CheckCircle sx={{ color: 'success.main' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Actionable Recommendations" 
                            secondary="Tailored lifestyle improvements and interventions"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  How the Hybrid System Works
                </Typography>
                <Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
                  <Typography variant="body1" paragraph>
                    <strong>Step 1:</strong> Your assessment data is processed through validated medical algorithms that have been used in clinical practice for decades.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Step 2:</strong> Llama-4 AI analyzes the algorithmic results alongside your complete health profile to provide personalized insights.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Step 3:</strong> The system generates comprehensive recommendations that combine evidence-based medicine with AI-powered personalization.
                  </Typography>
                  <Typography variant="body1">
                    <strong>Result:</strong> You receive medically sound risk predictions with personalized explanations and actionable health guidance.
                  </Typography>
                </Paper>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Assessment Components */}
          <Accordion expanded={expanded === 'assessment'} onChange={handleChange('assessment')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assessment color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Assessment Components & Impact Analysis
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6" gutterBottom>
                How Each Assessment Component Affects Your Results
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Demographics & Basic Health
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Factor</strong></TableCell>
                              <TableCell><strong>Impact on Results</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Age</TableCell>
                              <TableCell>Primary risk multiplier - older age increases all disease risks exponentially</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Sex</TableCell>
                              <TableCell>Gender-specific risk patterns (men: higher heart disease; women: different cancer risks)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Ethnicity</TableCell>
                              <TableCell>Population-specific risk adjustments (e.g., African Americans: +15-20% CVD risk)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>BMI</TableCell>
                              <TableCell>Obesity (BMI greater than 30): +10-15 health score penalty, increased diabetes/heart disease risk</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="secondary">
                        Lifestyle Factors
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Factor</strong></TableCell>
                              <TableCell><strong>Impact on Results</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Smoking</TableCell>
                              <TableCell>Major penalty: -25 health score points, +2.5x cancer risk, +50% heart disease risk</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Exercise</TableCell>
                              <TableCell>No exercise: -15 points; Heavy exercise: +8 points; Reduces all disease risks</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Diet</TableCell>
                              <TableCell>Affects cholesterol estimates, diabetes risk, and overall health score calculations</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Alcohol</TableCell>
                              <TableCell>Heavy drinking: -12 points, increased cancer risk; Moderate: slight protective effect</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="error">
                        Medical History
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Factor</strong></TableCell>
                              <TableCell><strong>Impact on Results</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Family History</TableCell>
                              <TableCell>CVD family history: -3 points; Diabetes: -3 points; Cancer: -3 points + risk multipliers</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Past Diagnoses</TableCell>
                              <TableCell>Existing diabetes: Major risk factor for heart disease; Previous cancer: Affects screening recommendations</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Current Symptoms</TableCell>
                              <TableCell>Influences AI recommendations and confidence scores in predictions</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Medications</TableCell>
                              <TableCell>Affects risk calculations (e.g., blood pressure medications modify Framingham score)</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="success">
                        Laboratory Results
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Test</strong></TableCell>
                              <TableCell><strong>Impact on Results</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Cholesterol Panel</TableCell>
                              <TableCell>Direct input to Framingham equation; High LDL significantly increases heart disease risk</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Blood Pressure</TableCell>
                              <TableCell>Systolic BP greater than 140: Major Framingham risk factor; Affects health score calculation</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbA1c/Glucose</TableCell>
                              <TableCell>Diabetes diagnosis modifier; Pre-diabetes affects risk calculations</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Other Biomarkers</TableCell>
                              <TableCell>Influences AI confidence scores and personalized recommendations</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Health Score Calculation */}
          <Accordion expanded={expanded === 'healthscore'} onChange={handleChange('healthscore')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Health Score Calculation Framework
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6" gutterBottom>
                Comprehensive Health Score Algorithm (Range: 15-95)
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="error">
                        Major Penalties
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Risk Factor</strong></TableCell>
                              <TableCell><strong>Point Penalty</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Smoking</TableCell>
                              <TableCell>-25 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Severe Obesity (BMI ≥35)</TableCell>
                              <TableCell>-15 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>No Exercise</TableCell>
                              <TableCell>-15 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Heavy Drinking</TableCell>
                              <TableCell>-12 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Obesity (BMI 30-34)</TableCell>
                              <TableCell>-10 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Minimal Exercise</TableCell>
                              <TableCell>-8 points</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="success">
                        Health Bonuses
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Positive Factor</strong></TableCell>
                              <TableCell><strong>Point Bonus</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Heavy Exercise</TableCell>
                              <TableCell>+8 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Healthy Weight (BMI 18.5-24.9)</TableCell>
                              <TableCell>+6 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Non-Smoker</TableCell>
                              <TableCell>+5 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Moderate Exercise</TableCell>
                              <TableCell>+5 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Young Age (less than 30)</TableCell>
                              <TableCell>+5 points</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Moderate Drinking</TableCell>
                              <TableCell>+3 points</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="body1">
                      <strong>Smart Score Capping:</strong> The system applies intelligent limits to ensure realistic scores:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Multiple high risks (greater than 20%): Maximum score capped at 45/100" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Single high risk: Maximum score capped at 65/100" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Overall range: 15-95 (prevents unrealistic perfect scores)" />
                      </ListItem>
                    </List>
                  </Alert>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Llama-4 AI Integration */}
          <Accordion expanded={expanded === 'ai'} onChange={handleChange('ai')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Psychology color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Llama-4 AI Integration & Reasoning
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        AI Model Specifications
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon><Info color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Model: Meta Llama-4 Scout 17B" 
                            secondary="Advanced reasoning model with medical knowledge"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Info color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Temperature: 0.3-0.4" 
                            secondary="Low temperature for consistent medical predictions"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Info color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Context Window: 2000 tokens" 
                            secondary="Comprehensive analysis of your complete health profile"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Info color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Response Format: Structured JSON" 
                            secondary="Ensures consistent, parseable medical insights"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        AI Enhancement Areas
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                          <ListItemText 
                            primary="Health Score Reasoning" 
                            secondary="Explains why your score is what it is based on your specific factors"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                          <ListItemText 
                            primary="Lifestyle Improvements" 
                            secondary="Personalized recommendations with point values for motivation"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                          <ListItemText 
                            primary="Personalized Insights" 
                            secondary="Context-aware analysis of your unique health situation"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                          <ListItemText 
                            primary="Risk Factor Prioritization" 
                            secondary="Identifies which factors have the highest impact for you"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom>
                      How AI Enhances Medical Algorithms
                    </Typography>
                    <Typography variant="body1" paragraph>
                      While the medical algorithms provide the scientific foundation for risk calculations, 
                      Llama-4 AI adds the human element - understanding context, explaining complex medical 
                      concepts in accessible language, and providing personalized guidance that considers 
                      your unique circumstances.
                    </Typography>
                    <Typography variant="body1">
                      This hybrid approach ensures you receive both medically accurate predictions and 
                      meaningful, actionable insights that can help improve your health outcomes.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

        </Box>

        {/* Final Medical Disclaimer */}
        <Alert severity="warning" sx={{ mt: 4 }}>
          <Typography variant="body1">
            <strong>Important:</strong> This system is designed for educational and informational purposes. 
            While it uses validated medical algorithms and advanced AI, it should never replace professional 
            medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for 
            medical decisions and before making significant lifestyle changes.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default EducationPage;
