import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  Favorite,
  LocalHospital,
  Security,
  TrendingUp,
  Person,
  Science,
  Assessment,
  School,
  Refresh,
  Warning,
  CheckCircle,
  Schedule,
  Add
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { RiskPrediction, UserProfile, LabResult } from '../types';

// Lab Results Card Component with Show More functionality
const LabResultsCard: React.FC<{ labResults: LabResult[] }> = ({ labResults }) => {
  const [showAll, setShowAll] = useState(false);
  const displayResults = showAll ? labResults : labResults.slice(0, 3);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Lab Results
        </Typography>
        {labResults.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Science sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No lab results added yet
            </Typography>
          </Box>
        ) : (
          <List dense>
            {displayResults.map((lab, index) => (
              <React.Fragment key={lab.id}>
                <ListItem>
                  <ListItemIcon>
                    <Science />
                  </ListItemIcon>
                  <ListItemText
                    primary={lab.test_name}
                    secondary={`${lab.test_value} ${lab.test_unit || ''} - ${new Date(lab.test_date).toLocaleDateString()}`}
                  />
                </ListItem>
                {index < displayResults.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" href="/data-collection" startIcon={<Add />}>
          Add Lab Results
        </Button>
        {labResults.length > 3 && (
          <Button 
            size="small" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show More (${labResults.length - 3} more)`}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
  profile: UserProfile | null;
  latestPredictions: RiskPrediction[];
  predictionHistory: RiskPrediction[];
  recentLabResults: LabResult[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    profile: null,
    latestPredictions: [],
    predictionHistory: [],
    recentLabResults: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Get ALL localStorage data for historical tracking
      const latestResults = localStorage.getItem('latestHealthResults');
      const historyData = localStorage.getItem('healthAssessmentHistory');
      
      let localPredictions: RiskPrediction[] = [];
      let localLabResults: LabResult[] = [];
      
      // Process latest results
      if (latestResults) {
        try {
          const results = JSON.parse(latestResults);
          const { healthVitalityIndex, riskPredictions, timestamp, algorithms } = results;
          
            // Convert localStorage format to RiskPrediction format
            localPredictions = Object.entries(riskPredictions).map(([disease, prediction]: [string, any], index) => ({
              id: Date.now() + index,
              user_id: user?.id || 'anonymous',
              disease_name: disease,
              risk_score: prediction.risk_score.toString(), // Already in decimal format (0.15 for 15%)
              risk_category: prediction.risk_category,
              confidence_score: prediction.confidence.toString(), // Already in decimal format (0.85 for 85%)
              model_version: algorithms || prediction.algorithm,
              prediction_date: timestamp,
              is_active: true,
              recommendations: [`Health Score: ${healthVitalityIndex.score}/100 (${healthVitalityIndex.category})`]
            }));

          // Add health vitality index as lab result
          localLabResults.push({
            id: Date.now(),
            user_id: user?.id || 'anonymous',
            test_name: 'Health Vitality Index',
            test_value: healthVitalityIndex.score.toString(),
            test_unit: '/100',
            reference_range: '0-100',
            test_date: timestamp,
            lab_name: 'AI Health Assessment',
            doctor_name: '',
            notes: `${healthVitalityIndex.category} Health - ${healthVitalityIndex.description}`,
            created_at: timestamp,
            updated_at: timestamp
          });
        } catch (parseError) {
          console.warn('Error parsing latest health results:', parseError);
        }
      }

      // Process historical data
      if (historyData) {
        try {
          const history = JSON.parse(historyData);
          console.log('Processing historical data:', history.length, 'entries');
          
          history.forEach((entry: any, sessionIndex: number) => {
            const { healthVitalityIndex, riskPredictions, timestamp, algorithms } = entry;
            console.log(`Processing history entry ${sessionIndex}:`, { timestamp, diseases: Object.keys(riskPredictions || {}) });
            
            // Add historical predictions
            if (riskPredictions) {
              Object.entries(riskPredictions).forEach(([disease, prediction]: [string, any], index) => {
                // Handle both decimal (0.15) and percentage (15) formats
                let riskScore = prediction.risk_score;
                if (typeof riskScore === 'number' && riskScore <= 1) {
                  // It's in decimal format, convert to percentage
                  riskScore = riskScore * 100;
                }
                
                localPredictions.push({
                  id: Date.now() + sessionIndex * 100 + index,
                  user_id: user?.id || 'anonymous',
                  disease_name: disease,
                  risk_score: riskScore.toString(),
                  risk_category: prediction.risk_category,
                  confidence_score: ((prediction.confidence || 0.85) * 100).toString(),
                  model_version: algorithms || prediction.algorithm || 'AI-Powered Analysis',
                  prediction_date: timestamp,
                  is_active: true,
                  recommendations: [`Health Score: ${healthVitalityIndex?.score || 'N/A'}/100 (${healthVitalityIndex?.category || 'Unknown'})`]
                });
                
                console.log(`Added historical prediction: ${disease} = ${riskScore}% on ${timestamp}`);
              });
            }

            // Add historical health scores as lab results
            if (healthVitalityIndex) {
              localLabResults.push({
                id: Date.now() + sessionIndex * 100,
                user_id: user?.id || 'anonymous',
                test_name: 'Health Vitality Index',
                test_value: healthVitalityIndex.score.toString(),
                test_unit: '/100',
                reference_range: '0-100',
                test_date: timestamp,
                lab_name: 'AI Health Assessment',
                doctor_name: '',
                notes: `${healthVitalityIndex.category} Health - ${healthVitalityIndex.description}`,
                created_at: timestamp,
                updated_at: timestamp
              });
              
              console.log(`Added historical health score: ${healthVitalityIndex.score}/100 on ${timestamp}`);
            }
          });
        } catch (parseError) {
          console.warn('Error parsing assessment history:', parseError);
        }
      }

      if (!user) {
        // If no user but we have local data, show it
        const latestPredictions: RiskPrediction[] = [];
        const seenDiseases = new Set();
        
        // Get latest prediction for each disease type
        localPredictions
          .sort((a, b) => new Date(b.prediction_date).getTime() - new Date(a.prediction_date).getTime())
          .forEach((pred) => {
            if (!seenDiseases.has(pred.disease_name)) {
              latestPredictions.push(pred);
              seenDiseases.add(pred.disease_name);
            }
          });

        setDashboardData({
          profile: null,
          latestPredictions,
          predictionHistory: localPredictions,
          recentLabResults: localLabResults
        });
        return;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch ALL predictions from Supabase for historical tracking
      const { data: allSupabasePredictions, error: predictionsError } = await supabase
        .from('risk_predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('prediction_date', { ascending: false });

      if (predictionsError) {
        console.warn('Error fetching predictions:', predictionsError);
      }

      // Combine local and remote predictions
      const allPredictions = [...localPredictions, ...(allSupabasePredictions || [])];
      
      // Get latest prediction for each disease type (for current risk cards)
      // Sort by date and keep only the most recent for each disease
      const latestPredictions: RiskPrediction[] = [];
      const diseaseMap = new Map();
      
      allPredictions.forEach((pred: any) => {
        const diseaseKey = pred.disease_name.toLowerCase().replace(/[^a-z]/g, '_');
        const predDate = new Date(pred.prediction_date).getTime();
        
        if (!diseaseMap.has(diseaseKey) || predDate > new Date(diseaseMap.get(diseaseKey).prediction_date).getTime()) {
          diseaseMap.set(diseaseKey, pred);
        }
      });
      
      // Convert map values to array
      latestPredictions.push(...Array.from(diseaseMap.values()));

      // Fetch ALL lab results for historical tracking
      const { data: labResults, error: labError } = await supabase
        .from('lab_results')
        .select('*')
        .eq('user_id', user.id)
        .order('test_date', { ascending: false });

      if (labError) {
        console.warn('Error fetching lab results:', labError);
      }

      // Combine and deduplicate lab results
      const allLabResults = [...localLabResults, ...(labResults || [])];
      
      // Deduplicate lab results by test_name and test_date
      const uniqueLabResults = allLabResults.filter((lab, index, self) => 
        index === self.findIndex(l => 
          l.test_name === lab.test_name && 
          new Date(l.test_date).toDateString() === new Date(lab.test_date).toDateString()
        )
      );

      setDashboardData({
        profile: profile || null,
        latestPredictions,
        predictionHistory: allPredictions,
        recentLabResults: uniqueLabResults
      });

    } catch (err: any) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const getRiskColor = (riskCategory: string) => {
    switch (riskCategory?.toLowerCase()) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getRiskIcon = (diseaseName: string) => {
    if (diseaseName?.toLowerCase().includes('heart')) return <Favorite />;
    if (diseaseName?.toLowerCase().includes('diabetes')) return <LocalHospital />;
    if (diseaseName?.toLowerCase().includes('cancer')) return <Security />;
    return <Assessment />;
  };

  const getProfileCompletionPercentage = () => {
    if (!dashboardData.profile) return 0;
    
    const { demographics_complete, lifestyle_complete, medical_history_complete } = dashboardData.profile;
    const completed = [demographics_complete, lifestyle_complete, medical_history_complete].filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  };

  const generateChartData = () => {
    const { predictionHistory, recentLabResults } = dashboardData;
    
    if (!predictionHistory.length && !recentLabResults.length) return null;

    // Group predictions by date to create assessment sessions
    const assessmentSessions: { [key: string]: any } = {};
    
    // Debug: Log all disease names to see what we're working with
    const uniqueDiseaseNames = Array.from(new Set(predictionHistory.map(pred => pred.disease_name)));
    console.log('All disease names in prediction history:', uniqueDiseaseNames);
    
    // Process Supabase prediction history - use more precise grouping
    predictionHistory.forEach(pred => {
      // Use hour-level precision to group assessments from same session
      const sessionKey = new Date(pred.prediction_date).toISOString().slice(0, 13); // YYYY-MM-DDTHH
      
      if (!assessmentSessions[sessionKey]) {
        assessmentSessions[sessionKey] = {
          timestamp: pred.prediction_date,
          riskPredictions: {},
          healthVitalityIndex: { score: null }
        };
      }
      
      // Convert risk_score - handle both decimal and percentage formats
      let riskScore = parseFloat(pred.risk_score);
      if (riskScore > 1) {
        // Already a percentage, convert to decimal
        riskScore = riskScore / 100;
      }
      
      // Store with original disease name as key
      assessmentSessions[sessionKey].riskPredictions[pred.disease_name] = {
        risk_score: riskScore,
        risk_category: pred.risk_category
      };
      
      // Debug: Log each prediction being processed
      console.log(`Processing ${pred.disease_name}: ${riskScore * 100}% on ${sessionKey}`);
    });

    // Process lab results to extract health vitality index
    recentLabResults.forEach(lab => {
      if (lab.test_name === 'Health Vitality Index') {
        // Use hour-level precision to match with predictions
        const sessionKey = new Date(lab.test_date).toISOString().slice(0, 13); // YYYY-MM-DDTHH
        
        if (assessmentSessions[sessionKey]) {
          assessmentSessions[sessionKey].healthVitalityIndex.score = parseFloat(lab.test_value);
        } else {
          assessmentSessions[sessionKey] = {
            timestamp: lab.test_date,
            riskPredictions: {},
            healthVitalityIndex: { score: parseFloat(lab.test_value) }
          };
        }
        
        console.log(`Added health score: ${lab.test_value}/100 on ${sessionKey}`);
      }
    });

    const allHistory = Object.values(assessmentSessions);
    
    if (!allHistory.length) return null;

    // Sort by timestamp
    allHistory.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Prepare data for Chart.js
    const labels = allHistory.map(entry => 
      new Date(entry.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    );

    const datasets = [
      {
        label: 'Heart Disease Risk',
        data: allHistory.map(entry => {
          const heartData = entry.riskPredictions?.heart_disease;
          return heartData ? heartData.risk_score * 100 : null;
        }),
        borderColor: '#e91e63',
        backgroundColor: '#e91e63',
        pointBackgroundColor: '#e91e63',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.1,
        spanGaps: true
      },
      {
        label: 'Diabetes Risk',
        data: allHistory.map(entry => {
          // Find any key that contains 'diabetes'
          const diabetesKey = Object.keys(entry.riskPredictions).find(key => 
            key.toLowerCase().includes('diabetes')
          );
          const diabetesData = diabetesKey ? entry.riskPredictions[diabetesKey] : null;
          return diabetesData ? diabetesData.risk_score * 100 : null;
        }),
        borderColor: '#2196f3',
        backgroundColor: '#2196f3',
        pointBackgroundColor: '#2196f3',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.1,
        spanGaps: true
      },
      {
        label: 'Cancer Risk',
        data: allHistory.map(entry => {
          // Find any key that contains 'cancer'
          const cancerKey = Object.keys(entry.riskPredictions).find(key => 
            key.toLowerCase().includes('cancer')
          );
          const cancerData = cancerKey ? entry.riskPredictions[cancerKey] : null;
          return cancerData ? cancerData.risk_score * 100 : null;
        }),
        borderColor: '#ff9800',
        backgroundColor: '#ff9800',
        pointBackgroundColor: '#ff9800',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.1,
        spanGaps: true
      },
      {
        label: 'Health Score',
        data: allHistory.map(entry => entry.healthVitalityIndex?.score || null),
        borderColor: '#4caf50',
        backgroundColor: '#4caf50',
        pointBackgroundColor: '#4caf50',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.1,
        spanGaps: true,
        yAxisID: 'y1'
      }
    ];

    return {
      labels,
      datasets
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Health Risk Trends Over Time',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'Health Score') {
              return `${label}: ${value}/100`;
            } else {
              return `${label}: ${value}%`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Assessment Date'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Risk Percentage (%)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Health Score'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value + '/100';
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} md={4} key={i}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Health Dashboard
          </Typography>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            color="primary"
          >
            {refreshing ? <CircularProgress size={24} /> : <Refresh />}
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}



        {/* Risk Trends Chart */}
        {dashboardData.predictionHistory.length >= 1 && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Trends ({dashboardData.predictionHistory.length} assessments)
              </Typography>
              <Box sx={{ height: 400 }}>
                {generateChartData() && (
                  <Line data={generateChartData()!} options={chartOptions} />
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Person />}
                  href="/data-collection"
                  sx={{ py: 2 }}
                >
                  Update Profile
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Science />}
                  href="/data-collection"
                  sx={{ py: 2 }}
                >
                  Add Lab Results
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assessment />}
                  href="/prediction"
                  sx={{ py: 2 }}
                >
                  New Prediction
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<School />}
                  href="/education"
                  sx={{ py: 2 }}
                >
                  Health Education
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Health Insights */}
          {dashboardData.latestPredictions.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Health Insights
                  </Typography>
                  <List dense>
                    {dashboardData.latestPredictions
                      .filter(pred => pred.recommendations && pred.recommendations.length > 0)
                      .slice(0, 3)
                      .map((prediction, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemIcon>
                              <Warning sx={{ color: getRiskColor(prediction.risk_category) }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={prediction.disease_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              secondary={prediction.recommendations?.[0] || 'No recommendations available'}
                            />
                          </ListItem>
                          {index < 2 && <Divider />}
                        </React.Fragment>
                      ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" href="/prediction">
                    View All Recommendations
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}

          {/* Recent Lab Results */}
          <Grid item xs={12} md={6}>
            <LabResultsCard 
              labResults={dashboardData.recentLabResults}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
