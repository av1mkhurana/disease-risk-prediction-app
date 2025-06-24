import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  LinearProgress,
  Alert,
  Stack,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Slider,
  Autocomplete,
  FormHelperText,
} from '@mui/material';
import {
  Info,
  Save,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Security,
  Schedule,
  Person,
  LocalHospital,
  FamilyRestroom,
  FitnessCenter,
  Psychology,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface FormData {
  // Demographics
  age: number | '';
  gender: string;
  ethnicity: string;
  height: number | '';
  weight: number | '';
  location: string;
  occupation: string;
  activityLevel: string;
  
  // Medical History
  currentMedications: string[];
  previousDiagnoses: string[];
  surgeries: string[];
  allergies: string[];
  
  // Family History
  familyDiabetes: boolean;
  familyHeartDisease: boolean;
  familyCancer: boolean;
  familyStroke: boolean;
  familyHypertension: boolean;
  
  // Lifestyle
  dietType: string;
  exerciseFrequency: string;
  sleepHours: number | '';
  stressLevel: number;
  smokingStatus: string;
  alcoholConsumption: string;
  
  // Current Symptoms
  currentSymptoms: string[];
  energyLevel: number;
  recentChanges: string;
}

const DataCollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: '',
    ethnicity: '',
    height: '',
    weight: '',
    location: '',
    occupation: '',
    activityLevel: '',
    currentMedications: [],
    previousDiagnoses: [],
    surgeries: [],
    allergies: [],
    familyDiabetes: false,
    familyHeartDisease: false,
    familyCancer: false,
    familyStroke: false,
    familyHypertension: false,
    dietType: '',
    exerciseFrequency: '',
    sleepHours: '',
    stressLevel: 5,
    smokingStatus: '',
    alcoholConsumption: '',
    currentSymptoms: [],
    energyLevel: 5,
    recentChanges: '',
  });

  const steps = [
    { 
      label: 'Basic Info', 
      icon: <Person />,
      description: 'Demographics & lifestyle',
      estimatedTime: '2-3 min'
    },
    { 
      label: 'Medical History', 
      icon: <LocalHospital />,
      description: 'Current health status',
      estimatedTime: '3-4 min'
    },
    { 
      label: 'Family History', 
      icon: <FamilyRestroom />,
      description: 'Genetic factors',
      estimatedTime: '2-3 min'
    },
    { 
      label: 'Lifestyle', 
      icon: <FitnessCenter />,
      description: 'Daily habits',
      estimatedTime: '2-3 min'
    },
    { 
      label: 'Current Health', 
      icon: <Psychology />,
      description: 'Recent symptoms',
      estimatedTime: '1-2 min'
    },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Store form data and navigate to prediction page
      localStorage.setItem('healthAssessmentData', JSON.stringify(formData));
      navigate('/prediction');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Tell Us About Yourself
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Basic information helps us understand your baseline health profile.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', parseInt(e.target.value) || '')}
                  InputProps={{ inputProps: { min: 18, max: 120 } }}
                  helperText="Must be 18 or older"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Gender"
                    onChange={(e) => updateFormData('gender', e.target.value)}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Ethnicity</InputLabel>
                  <Select
                    value={formData.ethnicity}
                    label="Ethnicity"
                    onChange={(e) => updateFormData('ethnicity', e.target.value)}
                  >
                    <MenuItem value="caucasian">Caucasian/White</MenuItem>
                    <MenuItem value="african_american">African American/Black</MenuItem>
                    <MenuItem value="hispanic_latino">Hispanic/Latino</MenuItem>
                    <MenuItem value="asian_american">Asian American</MenuItem>
                    <MenuItem value="native_american">Native American/Alaska Native</MenuItem>
                    <MenuItem value="pacific_islander">Pacific Islander</MenuItem>
                    <MenuItem value="mixed_other">Mixed/Other</MenuItem>
                  </Select>
                  <FormHelperText>
                    Used for ethnicity-specific health risk calculations based on major medical studies (Jackson Heart Study, MESA, HCHS/SOL, Strong Heart Study)
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateFormData('height', parseInt(e.target.value) || '')}
                  InputProps={{ inputProps: { min: 100, max: 250 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateFormData('weight', parseInt(e.target.value) || '')}
                  InputProps={{ inputProps: { min: 30, max: 300 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location (City, Country)"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  helperText="Helps assess environmental risk factors"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={formData.occupation}
                  onChange={(e) => updateFormData('occupation', e.target.value)}
                  helperText="Work environment affects health risks"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    value={formData.activityLevel}
                    label="Activity Level"
                    onChange={(e) => updateFormData('activityLevel', e.target.value)}
                  >
                    <MenuItem value="sedentary">Sedentary (desk job, little exercise)</MenuItem>
                    <MenuItem value="light">Light (some walking, light exercise)</MenuItem>
                    <MenuItem value="moderate">Moderate (regular exercise 3-4x/week)</MenuItem>
                    <MenuItem value="active">Active (exercise 5-6x/week)</MenuItem>
                    <MenuItem value="very-active">Very Active (intense daily exercise)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Medical History
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your medical background helps identify existing risk factors and patterns.
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Medications (comma separated)"
                  value={formData.currentMedications.join(', ')}
                  onChange={(e) => updateFormData('currentMedications', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="e.g., Aspirin, Lisinopril, Metformin"
                  helperText="Include prescription drugs, supplements, and regular over-the-counter medications"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Previous Diagnoses (comma separated)"
                  value={formData.previousDiagnoses.join(', ')}
                  onChange={(e) => updateFormData('previousDiagnoses', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="e.g., Hypertension, Diabetes Type 2, High Cholesterol"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Surgeries/Procedures (comma separated)"
                  value={formData.surgeries.join(', ')}
                  onChange={(e) => updateFormData('surgeries', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="e.g., Appendectomy, Knee replacement"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Allergies (comma separated)"
                  value={formData.allergies.join(', ')}
                  onChange={(e) => updateFormData('allergies', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="e.g., Penicillin, Peanuts, Shellfish"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Family Medical History
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Family history reveals genetic predispositions to certain conditions.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Has anyone in your immediate family (parents, siblings, children) been diagnosed with:
                </Typography>
              </Grid>
              
              {[
                { key: 'familyDiabetes', label: 'Diabetes (Type 1 or 2)', description: 'Including pre-diabetes' },
                { key: 'familyHeartDisease', label: 'Heart Disease', description: 'Heart attack, coronary artery disease, heart failure' },
                { key: 'familyCancer', label: 'Cancer', description: 'Any type of cancer' },
                { key: 'familyStroke', label: 'Stroke', description: 'Including mini-strokes (TIA)' },
                { key: 'familyHypertension', label: 'High Blood Pressure', description: 'Chronic hypertension requiring medication' },
              ].map((condition) => (
                <Grid item xs={12} key={condition.key}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData[condition.key as keyof FormData] as boolean}
                          onChange={(e) => updateFormData(condition.key as keyof FormData, e.target.checked)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {condition.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {condition.description}
                          </Typography>
                        </Box>
                      }
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Lifestyle Factors
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your daily habits significantly impact your long-term health risks.
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Diet Type</InputLabel>
                  <Select
                    value={formData.dietType}
                    label="Diet Type"
                    onChange={(e) => updateFormData('dietType', e.target.value)}
                  >
                    <MenuItem value="standard">Standard/Mixed Diet</MenuItem>
                    <MenuItem value="mediterranean">Mediterranean</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                    <MenuItem value="keto">Ketogenic</MenuItem>
                    <MenuItem value="paleo">Paleo</MenuItem>
                    <MenuItem value="low-carb">Low Carb</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Exercise Frequency</InputLabel>
                  <Select
                    value={formData.exerciseFrequency}
                    label="Exercise Frequency"
                    onChange={(e) => updateFormData('exerciseFrequency', e.target.value)}
                  >
                    <MenuItem value="never">Never</MenuItem>
                    <MenuItem value="rarely">Rarely (less than once/week)</MenuItem>
                    <MenuItem value="1-2-times">1-2 times per week</MenuItem>
                    <MenuItem value="3-4-times">3-4 times per week</MenuItem>
                    <MenuItem value="5-6-times">5-6 times per week</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sleep Hours per Night"
                  type="number"
                  value={formData.sleepHours}
                  onChange={(e) => updateFormData('sleepHours', parseFloat(e.target.value) || '')}
                  InputProps={{ inputProps: { min: 3, max: 12, step: 0.5 } }}
                  helperText="Average hours of sleep"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Smoking Status</InputLabel>
                  <Select
                    value={formData.smokingStatus}
                    label="Smoking Status"
                    onChange={(e) => updateFormData('smokingStatus', e.target.value)}
                  >
                    <MenuItem value="never">Never smoked</MenuItem>
                    <MenuItem value="former">Former smoker</MenuItem>
                    <MenuItem value="current-light">Current smoker (light)</MenuItem>
                    <MenuItem value="current-moderate">Current smoker (moderate)</MenuItem>
                    <MenuItem value="current-heavy">Current smoker (heavy)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Alcohol Consumption</InputLabel>
                  <Select
                    value={formData.alcoholConsumption}
                    label="Alcohol Consumption"
                    onChange={(e) => updateFormData('alcoholConsumption', e.target.value)}
                  >
                    <MenuItem value="never">Never</MenuItem>
                    <MenuItem value="rarely">Rarely (special occasions)</MenuItem>
                    <MenuItem value="light">Light (1-3 drinks/week)</MenuItem>
                    <MenuItem value="moderate">Moderate (4-7 drinks/week)</MenuItem>
                    <MenuItem value="heavy">Heavy (8+ drinks/week)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Stress Level
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={formData.stressLevel}
                    onChange={(_, value) => updateFormData('stressLevel', value)}
                    min={1}
                    max={10}
                    step={1}
                    marks={[
                      { value: 1, label: 'Very Low' },
                      { value: 5, label: 'Moderate' },
                      { value: 10, label: 'Very High' }
                    ]}
                    valueLabelDisplay="on"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Rate your average stress level over the past month
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Current Health Status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Tell us about any current symptoms or recent changes in your health.
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Symptoms (comma separated)"
                  value={formData.currentSymptoms.join(', ')}
                  onChange={(e) => updateFormData('currentSymptoms', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="e.g., Fatigue, Headache, Joint pain"
                  helperText="Leave empty if you have no current symptoms"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Energy Level
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={formData.energyLevel}
                    onChange={(_, value) => updateFormData('energyLevel', value)}
                    min={1}
                    max={10}
                    step={1}
                    marks={[
                      { value: 1, label: 'Very Low' },
                      { value: 5, label: 'Average' },
                      { value: 10, label: 'Very High' }
                    ]}
                    valueLabelDisplay="on"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  How would you rate your energy level over the past month?
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Recent Health Changes"
                  value={formData.recentChanges}
                  onChange={(e) => updateFormData('recentChanges', e.target.value)}
                  placeholder="Describe any recent changes in your health, weight, symptoms, or overall well-being..."
                  helperText="Optional: Any additional information that might be relevant"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Almost done!</strong> You're about to complete your health assessment. 
                    Our ethnicity-aware AI will analyze your information using validated clinical algorithms from major medical studies.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Health Assessment
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Help us understand your health profile for personalized risk analysis
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Chip icon={<Security />} label="Encrypted & Secure" color="primary" variant="outlined" />
          <Chip icon={<Schedule />} label={`${steps[activeStep].estimatedTime}`} color="secondary" variant="outlined" />
        </Stack>
      </Box>

      {/* Progress Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{ mb: 2 }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                icon={step.icon}
                optional={
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                }
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <LinearProgress 
          variant="determinate" 
          value={(activeStep / (steps.length - 1)) * 100} 
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Step {activeStep + 1} of {steps.length} • {Math.round((activeStep / (steps.length - 1)) * 100)}% Complete
        </Typography>
      </Box>

      {/* Form Content */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {renderStepContent(activeStep)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<NavigateBefore />}
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <NavigateNext />}
          variant="contained"
          sx={{ minWidth: 120 }}
        >
          {activeStep === steps.length - 1 ? 'Get Results' : 'Next'}
        </Button>
      </Box>

      {/* Privacy Notice */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Privacy Notice:</strong> All information is encrypted and stored securely. 
          We never share your personal health data with third parties. 
          You can delete your data at any time.
        </Typography>
      </Alert>
    </Container>
  );
};

export default DataCollectionPage;
