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
    if (!user) return;

    try {
      setError(null);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch latest predictions
      const { data: predictions, error: predictionsError } = await supabase
        .from('risk_predictions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('prediction_date', { ascending: false });

      if (predictionsError) {
        console.warn('Error fetching predictions:', predictionsError);
      }

      // Get latest prediction for each disease type
      const latestPredictions: RiskPrediction[] = [];
      const seenDiseases = new Set();
      
      (predictions || []).forEach((pred: any) => {
        if (!seenDiseases.has(pred.disease_name)) {
          latestPredictions.push(pred);
          seenDiseases.add(pred.disease_name);
        }
      });

      // Fetch recent lab results
      const { data: labResults, error: labError } = await supabase
        .from('lab_results')
        .select('*')
        .eq('user_id', user.id)
        .order('test_date', { ascending: false })
        .limit(5);

      if (labError) {
        console.warn('Error fetching lab results:', labError);
      }

      setDashboardData({
        profile: profile || null,
        latestPredictions,
        predictionHistory: predictions || [],
        recentLabResults: labResults || []
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
    const { predictionHistory } = dashboardData;
    
    if (!predictionHistory.length) return null;

    // Group by disease and sort by date
    const diseaseData: { [key: string]: { dates: string[], scores: number[] } } = {};
    
    predictionHistory.forEach(pred => {
      const disease = pred.disease_name;
      const date = new Date(pred.prediction_date).toLocaleDateString();
      const score = parseFloat(pred.risk_score);
      
      if (!diseaseData[disease]) {
        diseaseData[disease] = { dates: [], scores: [] };
      }
      
      diseaseData[disease].dates.push(date);
      diseaseData[disease].scores.push(score * 100); // Convert to percentage
    });

    // Get all unique dates and sort them
    const allDates = Array.from(new Set(
      Object.values(diseaseData).flatMap(data => data.dates)
    )).sort();

    const datasets = Object.entries(diseaseData).map(([disease, data], index) => {
      const colors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];
      return {
        label: disease.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        data: allDates.map(date => {
          const index = data.dates.indexOf(date);
          return index !== -1 ? data.scores[index] : null;
        }),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        tension: 0.4,
        spanGaps: true
      };
    });

    return {
      labels: allDates,
      datasets
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Risk Score Trends Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
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

        {/* Profile Completion Status */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile Completion
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={getProfileCompletionPercentage()} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {getProfileCompletionPercentage()}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={dashboardData.profile?.demographics_complete ? <CheckCircle /> : <Schedule />}
                label="Demographics"
                color={dashboardData.profile?.demographics_complete ? "success" : "default"}
                size="small"
              />
              <Chip
                icon={dashboardData.profile?.lifestyle_complete ? <CheckCircle /> : <Schedule />}
                label="Lifestyle"
                color={dashboardData.profile?.lifestyle_complete ? "success" : "default"}
                size="small"
              />
              <Chip
                icon={dashboardData.profile?.medical_history_complete ? <CheckCircle /> : <Schedule />}
                label="Medical History"
                color={dashboardData.profile?.medical_history_complete ? "success" : "default"}
                size="small"
              />
            </Box>
          </CardContent>
          {getProfileCompletionPercentage() < 100 && (
            <CardActions>
              <Button size="small" href="/data-collection" startIcon={<Person />}>
                Complete Profile
              </Button>
            </CardActions>
          )}
        </Card>

        {/* Risk Overview Cards */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Current Risk Assessment
        </Typography>
        
        {dashboardData.latestPredictions.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Assessment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Risk Predictions Available
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Complete your profile to get personalized risk assessments
              </Typography>
              <Button 
                variant="contained" 
                href="/prediction"
                startIcon={<TrendingUp />}
                disabled={getProfileCompletionPercentage() < 67}
              >
                Get Risk Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {dashboardData.latestPredictions.map((prediction, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: getRiskColor(prediction.risk_category), mr: 1 }}>
                        {getRiskIcon(prediction.disease_name)}
                      </Box>
                      <Typography variant="h6" component="div">
                        {prediction.disease_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h3" sx={{ color: getRiskColor(prediction.risk_category) }}>
                        {Math.round(parseFloat(prediction.risk_score) * 100)}%
                      </Typography>
                      <Chip
                        label={prediction.risk_category}
                        sx={{
                          backgroundColor: getRiskColor(prediction.risk_category),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Confidence: {Math.round(parseFloat(prediction.confidence_score || '0'))}%
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Last updated: {new Date(prediction.prediction_date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href="/prediction">
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Risk Trends Chart */}
        {dashboardData.predictionHistory.length > 1 && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Trends
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
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Lab Results
                </Typography>
                {dashboardData.recentLabResults.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Science sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No lab results added yet
                    </Typography>
                  </Box>
                ) : (
                  <List dense>
                    {dashboardData.recentLabResults.slice(0, 3).map((lab, index) => (
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
                        {index < Math.min(dashboardData.recentLabResults.length - 1, 2) && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" href="/data-collection" startIcon={<Add />}>
                  Add Lab Results
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
