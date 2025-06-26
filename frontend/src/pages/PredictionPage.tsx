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
  Insights,
  ExpandMore,
  Psychology,
  Lightbulb,
  TrendingDown,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RiskPrediction {
  risk_score: number;
  risk_percentage: string;
  risk_category: 'Low' | 'Medium' | 'High';
  confidence: number;
  algorithm: string;
}

interface HealthVitalityIndex {
  score: number;
  category: string;
  description: string;
}

const PredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { session } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Record<string, RiskPrediction>>({});
  const [healthIndex, setHealthIndex] = useState<HealthVitalityIndex | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processResults = async () => {
      try {
        // Clear any previous results to force fresh API call
        localStorage.removeItem('latestHealthResults');
        
        const savedData = localStorage.getItem('healthAssessmentData');
        if (!savedData) {
          setLoading(false);
          return;
        }

        const data = JSON.parse(savedData);
        
        // Try to call the actual Groq AI backend API
        let response;
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          };
          
          // Add authorization header if user is authenticated
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }
          
          response = await fetch('http://localhost:8000/api/v1/predictions/predict', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              include_lab_results: true,
              prediction_types: ["heart_disease", "diabetes", "cancer"],
              user_data: data // Send actual user data from assessment
            })
          });
        } catch (error) {
          console.log('API call failed, using fallback predictions');
          response = null;
        }

        if (response && response.ok) {
          const aiPredictions = await response.json();
          
          // Convert AI predictions to the format expected by the UI
          const formattedPredictions: Record<string, RiskPrediction> = {};
          
          aiPredictions.predictions.forEach((pred: any) => {
            const diseaseKey = pred.disease_name.toLowerCase().replace(' ', '_');
            formattedPredictions[diseaseKey] = {
              risk_score: pred.risk_score / 100, // Convert percentage to decimal for progress bars
              risk_percentage: `${pred.risk_score}%`,
              risk_category: pred.risk_category,
              confidence: pred.confidence_score / 100, // Convert percentage to decimal for display
              algorithm: "Groq AI - Llama-4"
            };
          });

          // Create health vitality index from AI predictions or overall assessment
          let healthScore = 75; // Default fallback
          if (aiPredictions.overall_assessment?.health_score) {
            healthScore = aiPredictions.overall_assessment.health_score;
          } else {
            // Calculate from risk scores if no overall assessment
            const avgRisk = Object.values(formattedPredictions).reduce((sum, pred) => sum + pred.risk_score, 0) / Object.values(formattedPredictions).length;
            healthScore = Math.round(100 - (avgRisk * 100));
          }
          
          const healthIndex: HealthVitalityIndex = {
            score: healthScore,
            category: categorizeHealthScore(healthScore),
            description: getHealthDescription(healthScore)
          };

          // Store comprehensive data including Llama-4 reasoning
          const comprehensiveData = {
            predictions: formattedPredictions,
            healthIndex,
            lifeExpectancy: aiPredictions.life_expectancy,
            llamaReasoning: aiPredictions.llama_reasoning,
            comprehensiveRecommendations: aiPredictions.comprehensive_recommendations,
            analysisNotes: aiPredictions.analysis_notes
          };

          setPredictions(formattedPredictions);
          setHealthIndex(healthIndex);
          
          // Store comprehensive data for integrated display
          localStorage.setItem('comprehensiveHealthData', JSON.stringify(comprehensiveData));
        } else {
          // No fallback - show error if API fails
          throw new Error(`API request failed with status: ${response?.status || 'Network Error'}`);
        }
      } catch (error) {
        console.error('Error calling AI predictions:', error);
        // Set error state instead of throwing
        setError('Unable to generate predictions. Please ensure the AI service is running and try again.');
      } finally {
        setLoading(false);
      }
    };
    
    processResults();
  }, []);


  const categorizeHealthScore = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Poor';
    return 'Critical';
  };

  const calculatePercentile = (score: number, age: number, gender: string) => {
    const means = {
      "20-39": { male: 72, female: 75 },
      "40-59": { male: 68, female: 71 },
      "60-79": { male: 62, female: 66 }
    };
    
    const ageGroup = age < 40 ? "20-39" : age < 60 ? "40-59" : "60-79";
    const mean = means[ageGroup as keyof typeof means][gender as keyof typeof means["20-39"]];
    const zScore = (score - mean) / 15;
    
    if (zScore >= 2.0) return 98;
    if (zScore >= 1.5) return 93;
    if (zScore >= 1.0) return 84;
    if (zScore >= 0.5) return 69;
    if (zScore >= 0) return 50;
    if (zScore >= -0.5) return 31;
    if (zScore >= -1.0) return 16;
    if (zScore >= -1.5) return 7;
    return 2;
  };

  const getHealthDescription = (score: number) => {
    if (score >= 90) return `Outstanding health! You're performing exceptionally well.`;
    if (score >= 80) return `Excellent health. Keep up the great work with your healthy lifestyle.`;
    if (score >= 70) return `Good health with room for improvement. Focus on key areas to boost your score.`;
    if (score >= 60) return `Fair health. Consider making lifestyle changes to improve your overall wellness.`;
    return `Your health needs attention. Consider consulting healthcare providers for guidance.`;
  };

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

  const HealthSpectrum: React.FC<{ score: number }> = ({ score }) => {
    const spectrumSegments = [
      { label: 'Critical', range: [0, 30], color: '#d32f2f' },
      { label: 'Poor', range: [31, 50], color: '#f44336' },
      { label: 'Fair', range: [51, 65], color: '#ff9800' },
      { label: 'Good', range: [66, 75], color: '#ffeb3b' },
      { label: 'Very Good', range: [76, 85], color: '#8bc34a' },
      { label: 'Excellent', range: [86, 95], color: '#4caf50' },
      { label: 'Optimal', range: [96, 100], color: '#2e7d32' },
    ];
    
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Health Vitality Spectrum
        </Typography>
        <Box sx={{ position: 'relative', height: 60, mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            height: 40, 
            borderRadius: 20,
            overflow: 'hidden',
            border: '2px solid #e0e0e0'
          }}>
            {spectrumSegments.map((segment, index) => (
              <Box
                key={index}
                sx={{
                  flex: segment.range[1] - segment.range[0],
                  backgroundColor: segment.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {!isMobile && segment.label}
              </Box>
            ))}
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              top: -5,
              left: `${score}%`,
              transform: 'translateX(-50%)',
              zIndex: 10
            }}
          >
            <Box sx={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '15px solid #333',
              mb: 0.5
            }} />
            <Typography variant="body2" sx={{ 
              textAlign: 'center', 
              fontWeight: 'bold',
              color: '#333',
              minWidth: 40
            }}>
              {score}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Unhealthy
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Optimal
          </Typography>
        </Box>
      </Box>
    );
  };

  const ComprehensiveResultsSection: React.FC = () => {
    const [comprehensiveData, setComprehensiveData] = useState<any>(null);

    useEffect(() => {
      const data = localStorage.getItem('comprehensiveHealthData');
      if (data) {
        try {
          setComprehensiveData(JSON.parse(data));
        } catch (e) {
          console.error('Error parsing comprehensive data:', e);
        }
      }
    }, []);

    if (!comprehensiveData) {
      return null;
    }

    const { lifeExpectancy, llamaReasoning, comprehensiveRecommendations } = comprehensiveData;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Comprehensive Health Analysis
        </Typography>
        
        {/* Llama-4 Health Score Reasoning */}
        {llamaReasoning?.health_score_reasoning && (
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  AI Health Score Analysis
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.6, opacity: 0.95 }}>
                {llamaReasoning.health_score_reasoning}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Life Expectancy Analysis */}
        {lifeExpectancy && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccessTime sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Life Expectancy Analysis
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)', color: 'white' }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {lifeExpectancy.current_life_expectancy}
                    </Typography>
                    <Typography variant="h6">Years</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Current Life Expectancy
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {lifeExpectancy.years_remaining}
                    </Typography>
                    <Typography variant="h6">Years</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Years Remaining
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      +{Object.values(lifeExpectancy.potential_gains || {}).reduce((sum: number, gain: any) => sum + (typeof gain === 'number' ? gain : 0), 0).toFixed(1)}
                    </Typography>
                    <Typography variant="h6">Years</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Potential Gains
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {lifeExpectancy.potential_gains && Object.keys(lifeExpectancy.potential_gains).length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Potential Life Expectancy Gains
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(lifeExpectancy.potential_gains).map(([improvement, years]: [string, any]) => (
                      <Grid item xs={12} sm={6} key={improvement}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                          <TrendingUp sx={{ mr: 2, color: 'success.main' }} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              +{typeof years === 'number' ? years.toFixed(1) : years} years
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {improvement.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Lifestyle Improvements */}
        {llamaReasoning?.lifestyle_improvements && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Lightbulb sx={{ mr: 2, fontSize: 32, color: 'warning.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  AI-Powered Lifestyle Recommendations
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {llamaReasoning.lifestyle_improvements.map((improvement: string, index: number) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Chip 
                        label={index + 1} 
                        size="small" 
                        sx={{ mr: 2, mt: 0.5, backgroundColor: 'primary.main', color: 'white' }} 
                      />
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        {improvement}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Personalized Insights */}
        {llamaReasoning?.personalized_insights && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Psychology sx={{ mr: 2, fontSize: 32, color: 'secondary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Personalized Health Insights
                </Typography>
              </Box>
              
              <List>
                {llamaReasoning.personalized_insights.map((insight: string, index: number) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: 'success.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={insight}
                      primaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Comprehensive Recommendations */}
        {comprehensiveRecommendations && comprehensiveRecommendations.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Complete Action Plan
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    All Recommendations ({comprehensiveRecommendations.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {comprehensiveRecommendations.map((recommendation: string, index: number) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            sx={{ mr: 2, mt: 0.5, backgroundColor: 'secondary.main', color: 'white' }} 
                          />
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            {recommendation}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Analyzing Your Health Profile...
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Groq AI with Llama-4 is analyzing your unique health profile for personalized risk assessment.
          </Typography>
          <LinearProgress sx={{ maxWidth: 400, mx: 'auto' }} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Using advanced AI to generate personalized predictions...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/data-collection')}
            sx={{ mr: 2 }}
          >
            Retake Assessment
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  if (!healthIndex) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Unable to generate health predictions. Please retake the assessment.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your Medical Risk Assessment
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Evidence-based analysis using validated clinical algorithms
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Chip icon={<CheckCircle />} label="Analysis Complete" color="success" />
          <Chip icon={<Science />} label="Clinical Algorithms" color="primary" variant="outlined" />
          <Chip icon={<HealthAndSafety />} label="Medical Grade" color="secondary" variant="outlined" />
        </Stack>
      </Box>

      {/* Health Vitality Index */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Health Vitality Index
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={healthIndex.score}
                size={140}
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
                <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
                  {healthIndex.score}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  out of 100
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            {healthIndex.category} Health
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                AI-Powered
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Analysis
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Medical
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Grade
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            {healthIndex.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Health Spectrum */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <HealthSpectrum score={healthIndex.score} />
        </CardContent>
      </Card>

      {/* Disease Risk Analysis */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Clinical Risk Analysis
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(predictions).filter(([key]) => key !== 'health_vitality_index').map(([disease, prediction]) => (
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
      </Box>

      {/* Population Comparison */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Groups sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Population Comparison
            </Typography>
            <Typography variant="body1" color="text.secondary">
              See how your health compares to others in your demographic
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: getScoreColor(healthIndex.score) }}>
                  {healthIndex.score}
                </Typography>
                <Typography variant="h6" gutterBottom>Health Score</Typography>
                <Typography variant="body2" color="text.secondary">
                  Your overall health vitality score out of 100
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {healthIndex.category}
                </Typography>
                <Typography variant="h6" gutterBottom>Health Category</Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on AI-powered medical risk assessment
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Comprehensive Results Section with Llama-4 Reasoning */}
      <ComprehensiveResultsSection />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        
        <Button
          variant="outlined"
          size="large"
          onClick={async () => {
            // Save results to localStorage for dashboard access
            const currentResults = {
              healthVitalityIndex: healthIndex,
              riskPredictions: predictions,
              timestamp: new Date().toISOString(),
              algorithms: predictions[Object.keys(predictions)[0]]?.algorithm || "AI-Powered Analysis"
            };
            
            // Save to localStorage as backup
            localStorage.setItem('latestHealthResults', JSON.stringify(currentResults));
            
            // Also save to historical tracking array
            const existingHistory = localStorage.getItem('healthAssessmentHistory');
            let historyArray = [];
            
            if (existingHistory) {
              try {
                historyArray = JSON.parse(existingHistory);
              } catch (e) {
                historyArray = [];
              }
            }
            
            // Add current results to history
            historyArray.push(currentResults);
            
            // Keep only last 20 assessments to prevent localStorage bloat
            if (historyArray.length > 20) {
              historyArray = historyArray.slice(-20);
            }
            
            // Save updated history
            localStorage.setItem('healthAssessmentHistory', JSON.stringify(historyArray));
            
            // Save to Supabase if user is authenticated
            if (session?.user) {
              try {
                const { supabase } = await import('../lib/supabase');
                
                // Save each disease prediction to risk_predictions table
                const predictionInserts = Object.entries(predictions).map(([disease, prediction]) => ({
                  user_id: session.user.id,
                  disease_name: disease,
                  risk_score: (prediction.risk_score * 100).toString(), // Convert to percentage string
                  risk_category: prediction.risk_category,
                  confidence_score: (prediction.confidence * 100).toString(),
                  model_version: prediction.algorithm || "AI-Powered Analysis",
                  features_used: ['age', 'gender', 'lifestyle', 'medical_history'],
                  recommendations: [`Health Score: ${healthIndex.score}/100 (${healthIndex.category})`],
                  prediction_date: new Date().toISOString(),
                  is_active: true
                }));

                // Insert predictions into Supabase
                const { error: predictionError } = await supabase
                  .from('risk_predictions')
                  .insert(predictionInserts);

                if (predictionError) {
                  console.error('Error saving predictions to Supabase:', predictionError);
                } else {
                  console.log('Successfully saved predictions to Supabase');
                }

                // Also save health vitality index as a lab result
                const { error: labError } = await supabase
                  .from('lab_results')
                  .insert({
                    user_id: session.user.id,
                    test_name: 'Health Vitality Index',
                    test_value: healthIndex.score.toString(),
                    test_unit: '/100',
                    reference_range: '0-100',
                    test_date: new Date().toISOString(),
                    lab_name: 'AI Health Assessment',
                    notes: `${healthIndex.category} Health - ${healthIndex.description}`
                  });

                if (labError) {
                  console.error('Error saving health score to lab_results:', labError);
                } else {
                  console.log('Successfully saved health score to lab_results');
                }

              } catch (error) {
                console.error('Error saving to Supabase:', error);
              }
            }
            
            navigate('/dashboard');
          }}
          sx={{ px: 4, py: 1.5 }}
        >
          View My Dashboard
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([JSON.stringify({
              healthVitalityIndex: healthIndex,
              riskPredictions: predictions,
              timestamp: new Date().toISOString(),
              algorithms: "Framingham, ADA, NCI"
            }, null, 2)], { type: 'application/json' });
            element.href = URL.createObjectURL(file);
            element.download = 'medical-risk-assessment.json';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
        >
          Download Report
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Share />}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Health Vitality Index',
                text: `I scored ${healthIndex.score}/100 on my medical risk assessment!`,
                url: window.location.href
              });
            }
          }}
        >
          Share Results
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
          <strong>Medical Disclaimer:</strong> This assessment uses validated clinical algorithms (Framingham Risk Score, ADA Risk Calculator, NCI Models) 
          for educational purposes only. Results should not replace professional medical advice. Always consult qualified healthcare providers for medical decisions.
        </Typography>
      </Alert>
    </Container>
  );
};

export default PredictionPage;
