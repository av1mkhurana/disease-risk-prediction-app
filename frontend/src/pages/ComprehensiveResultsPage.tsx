import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Favorite,
  LocalHospital,
  CheckCircle,
  Timeline,
  HealthAndSafety,
  Download,
  Share,
  Science,
  TrendingUp,
  Groups,
  ExpandMore,
  FitnessCenter,
  Restaurant,
  SmokingRooms,
  LocalBar,
  Schedule,
  Psychology,
  MonitorHeart,
  Insights,
  TrendingDown,
  Star,
  Warning,
  Info,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RiskPrediction {
  risk_score: number;
  risk_percentage: string;
  risk_category: 'Low' | 'Medium' | 'High';
  confidence: number;
  algorithm: string;
  key_risk_factors?: string[];
  recommendations?: string[];
}

interface HealthVitalityIndex {
  score: number;
  category: string;
  description: string;
}

interface LifeExpectancy {
  current_life_expectancy: number;
  base_life_expectancy: number;
  risk_adjustment: number;
  lifestyle_adjustment: number;
  potential_gains: Record<string, number>;
  years_remaining: number;
}

interface ComprehensiveResults {
  healthVitalityIndex: HealthVitalityIndex;
  riskPredictions: Record<string, RiskPrediction>;
  lifeExpectancy?: LifeExpectancy;
  comprehensiveRecommendations?: string[];
  timestamp: string;
  algorithms: string;
}

const ComprehensiveResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { session } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ComprehensiveResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = () => {
      try {
        const savedResults = localStorage.getItem('latestHealthResults');
        if (!savedResults) {
          setError('No assessment results found. Please complete an assessment first.');
          setLoading(false);
          return;
        }

        const parsedResults = JSON.parse(savedResults);
        setResults(parsedResults);
      } catch (error) {
        console.error('Error loading results:', error);
        setError('Error loading assessment results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadResults();
  }, []);

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'Low': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'High': return '#f44336';
      default: return '#757575';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#8bc34a';
    if (score >= 70) return '#ffeb3b';
    if (score >= 60) return '#ff9800';
    if (score >= 50) return '#f44336';
    return '#d32f2f';
  };

  const getLifestyleIcon = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('exercise') || recommendation.toLowerCase().includes('physical')) {
      return <FitnessCenter />;
    }
    if (recommendation.toLowerCase().includes('diet') || recommendation.toLowerCase().includes('eat')) {
      return <Restaurant />;
    }
    if (recommendation.toLowerCase().includes('smoking') || recommendation.toLowerCase().includes('tobacco')) {
      return <SmokingRooms />;
    }
    if (recommendation.toLowerCase().includes('alcohol')) {
      return <LocalBar />;
    }
    if (recommendation.toLowerCase().includes('sleep')) {
      return <Schedule />;
    }
    if (recommendation.toLowerCase().includes('stress')) {
      return <Psychology />;
    }
    return <MonitorHeart />;
  };

  const getPriorityLevel = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('quit smoking') || 
        recommendation.toLowerCase().includes('consult') ||
        recommendation.toLowerCase().includes('immediate')) {
      return 'High';
    }
    if (recommendation.toLowerCase().includes('monitor') || 
        recommendation.toLowerCase().includes('regular')) {
      return 'Medium';
    }
    return 'Low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Loading Your Comprehensive Results...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !results) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'No results available'}
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/data-collection')}
          >
            Take Assessment
          </Button>
        </Box>
      </Container>
    );
  }

  const { healthVitalityIndex, riskPredictions, lifeExpectancy, comprehensiveRecommendations } = results;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Comprehensive Health Assessment
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Complete analysis with life expectancy and personalized action plan
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Chip icon={<CheckCircle />} label="Analysis Complete" color="success" />
          <Chip icon={<Science />} label="Evidence-Based" color="primary" variant="outlined" />
          <Chip icon={<Insights />} label="Comprehensive" color="secondary" variant="outlined" />
        </Stack>
      </Box>

      {/* Health Score Overview */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={healthVitalityIndex.score}
                    size={120}
                    thickness={8}
                    sx={{ color: 'white' }}
                  />
                  <Box sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                      {healthVitalityIndex.score}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Health Score
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {healthVitalityIndex.category} Health
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Your Health Summary
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                {healthVitalityIndex.description}
              </Typography>
              
              {lifeExpectancy && (
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {lifeExpectancy.current_life_expectancy}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Life Expectancy
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {lifeExpectancy.years_remaining}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Years Remaining
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: lifeExpectancy.lifestyle_adjustment >= 0 ? '#4caf50' : '#f44336' }}>
                        {lifeExpectancy.lifestyle_adjustment > 0 ? '+' : ''}{lifeExpectancy.lifestyle_adjustment}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Lifestyle Impact
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        +{Object.values(lifeExpectancy.potential_gains).reduce((sum, gain) => sum + gain, 0).toFixed(1)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Potential Gains
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Disease Risk Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            <MonitorHeart sx={{ mr: 1, verticalAlign: 'middle' }} />
            Disease Risk Analysis
          </Typography>
          
          <Grid container spacing={3}>
            {Object.entries(riskPredictions).filter(([key]) => key !== 'health_vitality_index').map(([disease, prediction]) => (
              <Grid item xs={12} md={4} key={disease}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {disease === 'heart_disease' && <Favorite sx={{ mr: 1, color: '#e91e63' }} />}
                      {disease === 'diabetes' && <LocalHospital sx={{ mr: 1, color: '#2196f3' }} />}
                      {disease === 'cancer' && <HealthAndSafety sx={{ mr: 1, color: '#ff9800' }} />}
                      <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {disease.replace('_', ' ')} Risk
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">10-Year Risk:</Typography>
                        <Chip 
                          label={prediction.risk_category}
                          size="small"
                          sx={{ 
                            backgroundColor: getRiskColor(prediction.risk_category),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={prediction.risk_score * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getRiskColor(prediction.risk_category)
                          }
                        }}
                      />
                      <Typography variant="h6" sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        {prediction.risk_percentage}
                      </Typography>
                    </Box>
                    
                    {prediction.key_risk_factors && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Key Risk Factors:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {prediction.key_risk_factors.slice(0, 3).map((factor, index) => (
                            <Chip 
                              key={index}
                              label={factor}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Algorithm: {prediction.algorithm}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Confidence: {(prediction.confidence * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Life Expectancy Analysis */}
      {lifeExpectancy && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
              Life Expectancy Analysis
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Current Projection
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Based on your current health profile and lifestyle
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {lifeExpectancy.current_life_expectancy} years
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({lifeExpectancy.years_remaining} years remaining)
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Breakdown:</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Base life expectancy:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {lifeExpectancy.base_life_expectancy} years
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Risk adjustment:</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: lifeExpectancy.risk_adjustment >= 0 ? 'success.main' : 'error.main'
                        }}
                      >
                        {lifeExpectancy.risk_adjustment > 0 ? '+' : ''}{lifeExpectancy.risk_adjustment} years
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Lifestyle adjustment:</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: lifeExpectancy.lifestyle_adjustment >= 0 ? 'success.main' : 'error.main'
                        }}
                      >
                        {lifeExpectancy.lifestyle_adjustment > 0 ? '+' : ''}{lifeExpectancy.lifestyle_adjustment} years
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Potential Life Gains
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                    Years you could add through lifestyle changes
                  </Typography>
                  
                  {Object.entries(lifeExpectancy.potential_gains).map(([change, gain]) => (
                    <Box key={change} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {change.replace('_', ' ')}:
                        </Typography>
                        <Chip 
                          label={`+${gain.toFixed(1)} years`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(gain / Math.max(...Object.values(lifeExpectancy.potential_gains))) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                        color="success"
                      />
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      +{Object.values(lifeExpectancy.potential_gains).reduce((sum, gain) => sum + gain, 0).toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total potential years
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Comprehensive Recommendations */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
            Personalized Action Plan
          </Typography>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <Warning sx={{ mr: 1, verticalAlign: 'middle', color: 'error.main' }} />
                High Priority Actions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {(comprehensiveRecommendations || [])
                  .filter(rec => getPriorityLevel(rec) === 'High')
                  .map((recommendation, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        {getLifestyleIcon(recommendation)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={recommendation}
                        secondary={`Priority: ${getPriorityLevel(recommendation)}`}
                      />
                      <Chip 
                        label="High"
                        size="small"
                        sx={{ 
                          backgroundColor: getPriorityColor('High'),
                          color: 'white'
                        }}
                      />
                    </ListItem>
                  ))}
              </List>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <Info sx={{ mr: 1, verticalAlign: 'middle', color: 'warning.main' }} />
                Medium Priority Actions
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {(comprehensiveRecommendations || [])
                  .filter(rec => getPriorityLevel(rec) === 'Medium')
                  .map((recommendation, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        {getLifestyleIcon(recommendation)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={recommendation}
                        secondary={`Priority: ${getPriorityLevel(recommendation)}`}
                      />
                      <Chip 
                        label="Medium"
                        size="small"
                        sx={{ 
                          backgroundColor: getPriorityColor('Medium'),
                          color: 'white'
                        }}
                      />
                    </ListItem>
                  ))}
              </List>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <CheckCircle sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
                Maintenance & Prevention
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {(comprehensiveRecommendations || [])
                  .filter(rec => getPriorityLevel(rec) === 'Low')
                  .map((recommendation, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        {getLifestyleIcon(recommendation)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={recommendation}
                        secondary={`Priority: ${getPriorityLevel(recommendation)}`}
                      />
                      <Chip 
                        label="Low"
                        size="small"
                        sx={{ 
                          backgroundColor: getPriorityColor('Low'),
                          color: 'white'
                        }}
                      />
                    </ListItem>
                  ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{ px: 4, py: 1.5 }}
        >
          View Dashboard
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
            element.href = URL.createObjectURL(file);
            element.download = 'comprehensive-health-assessment.json';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
        >
          Download Report
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => navigate('/data-collection')}
        >
          Retake Assessment
        </Button>
      </Box>

      {/* Medical Disclaimer */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Medical Disclaimer:</strong> This comprehensive assessment uses evidence-based medical algorithms 
          and AI analysis for educational purposes only. Life expectancy calculations are estimates based on population data 
          and individual risk factors. Results should not replace professional medical advice. Always consult qualified 
          healthcare providers for medical decisions and personalized health planning.
        </Typography>
      </Alert>
    </Container>
  );
};

export default ComprehensiveResultsPage;
