import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  LocalHospital,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface HealthData {
  // Demographics
  age: string;
  gender: string;
  height: string;
  weight: string;
  ethnicity: string;
  
  // Lifestyle
  activityLevel: string;
  smokingStatus: string;
  alcoholConsumption: string;
  sleepHours: string;
  stressLevel: string;
  
  // Medical History
  familyHeartDisease: boolean;
  familyDiabetes: boolean;
  familyCancer: boolean;
  currentMedications: string;
  pastDiagnoses: string;
}

const steps = ['Demographics', 'Lifestyle', 'Medical History'];

const DataCollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [healthData, setHealthData] = useState<HealthData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    ethnicity: '',
    activityLevel: '',
    smokingStatus: '',
    alcoholConsumption: '',
    sleepHours: '',
    stressLevel: '',
    familyHeartDisease: false,
    familyDiabetes: false,
    familyCancer: false,
    currentMedications: '',
    pastDiagnoses: '',
  });

  const handleInputChange = (field: keyof HealthData, value: any) => {
    setHealthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Save data and navigate to prediction
      localStorage.setItem('healthAssessmentData', JSON.stringify(healthData));
      navigate('/prediction');
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Demographics
        return healthData.age && healthData.gender && healthData.height && healthData.weight;
      case 1: // Lifestyle
        return healthData.activityLevel && healthData.smokingStatus && healthData.sleepHours;
      case 2: // Medical History
        return true; // Optional fields
      default:
        return false;
    }
  };

  const renderDemographicsStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Age"
          type="number"
          value={healthData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          inputProps={{ min: 18, max: 120 }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={healthData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Height (cm)"
          type="number"
          value={healthData.height}
          onChange={(e) => handleInputChange('height', e.target.value)}
          inputProps={{ min: 100, max: 250 }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Weight (kg)"
          type="number"
          value={healthData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          inputProps={{ min: 30, max: 300 }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Ethnicity</InputLabel>
          <Select
            value={healthData.ethnicity}
            onChange={(e) => handleInputChange('ethnicity', e.target.value)}
            label="Ethnicity"
          >
            <MenuItem value="caucasian">Caucasian</MenuItem>
            <MenuItem value="african_american">African American</MenuItem>
            <MenuItem value="hispanic">Hispanic</MenuItem>
            <MenuItem value="asian">Asian</MenuItem>
            <MenuItem value="native_american">Native American</MenuItem>
            <MenuItem value="pacific_islander">Pacific Islander</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderLifestyleStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Activity Level</InputLabel>
          <Select
            value={healthData.activityLevel}
            onChange={(e) => handleInputChange('activityLevel', e.target.value)}
            label="Activity Level"
          >
            <MenuItem value="sedentary">Sedentary (little to no exercise)</MenuItem>
            <MenuItem value="light">Light (1-3 days/week)</MenuItem>
            <MenuItem value="moderate">Moderate (3-5 days/week)</MenuItem>
            <MenuItem value="active">Active (6-7 days/week)</MenuItem>
            <MenuItem value="very_active">Very Active (2x/day or intense)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Smoking Status</InputLabel>
          <Select
            value={healthData.smokingStatus}
            onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
            label="Smoking Status"
          >
            <MenuItem value="never">Never smoked</MenuItem>
            <MenuItem value="former">Former smoker</MenuItem>
            <MenuItem value="current">Current smoker</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Alcohol Consumption</InputLabel>
          <Select
            value={healthData.alcoholConsumption}
            onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
            label="Alcohol Consumption"
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="light">Light (1-3 drinks/week)</MenuItem>
            <MenuItem value="moderate">Moderate (4-7 drinks/week)</MenuItem>
            <MenuItem value="heavy">Heavy (8+ drinks/week)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Sleep Hours per Night"
          type="number"
          value={healthData.sleepHours}
          onChange={(e) => handleInputChange('sleepHours', e.target.value)}
          inputProps={{ min: 3, max: 12 }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Stress Level (1-10)</InputLabel>
          <Select
            value={healthData.stressLevel}
            onChange={(e) => handleInputChange('stressLevel', e.target.value)}
            label="Stress Level"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <MenuItem key={level} value={level.toString()}>
                {level} - {level <= 3 ? 'Low' : level <= 6 ? 'Moderate' : 'High'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderMedicalHistoryStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Family History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select any conditions that run in your immediate family (parents, siblings)
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label="Heart Disease"
            clickable
            color={healthData.familyHeartDisease ? "primary" : "default"}
            onClick={() => handleInputChange('familyHeartDisease', !healthData.familyHeartDisease)}
            icon={healthData.familyHeartDisease ? <CheckCircle /> : undefined}
          />
          <Chip
            label="Diabetes"
            clickable
            color={healthData.familyDiabetes ? "primary" : "default"}
            onClick={() => handleInputChange('familyDiabetes', !healthData.familyDiabetes)}
            icon={healthData.familyDiabetes ? <CheckCircle /> : undefined}
          />
          <Chip
            label="Cancer"
            clickable
            color={healthData.familyCancer ? "primary" : "default"}
            onClick={() => handleInputChange('familyCancer', !healthData.familyCancer)}
            icon={healthData.familyCancer ? <CheckCircle /> : undefined}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Current Medications"
          multiline
          rows={3}
          value={healthData.currentMedications}
          onChange={(e) => handleInputChange('currentMedications', e.target.value)}
          placeholder="List any medications you're currently taking (optional)"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Past Medical Diagnoses"
          multiline
          rows={3}
          value={healthData.pastDiagnoses}
          onChange={(e) => handleInputChange('pastDiagnoses', e.target.value)}
          placeholder="List any significant past medical conditions (optional)"
        />
      </Grid>
    </Grid>
  );

  const getStepIcon = (step: number) => {
    switch (step) {
      case 0: return <Person />;
      case 1: return <FitnessCenter />;
      case 2: return <LocalHospital />;
      default: return <Person />;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return renderDemographicsStep();
      case 1: return renderLifestyleStep();
      case 2: return renderMedicalHistoryStep();
      default: return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Health Assessment
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Help us understand your health profile for personalized risk predictions
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel icon={getStepIcon(index)}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStepIcon(activeStep)}
              {steps[activeStep]}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              {renderStepContent()}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<NavigateBefore />}
            variant="outlined"
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <NavigateNext />}
            variant="contained"
            size="large"
          >
            {activeStep === steps.length - 1 ? 'Get My Risk Assessment' : 'Next'}
          </Button>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Privacy Notice:</strong> Your health information is processed locally and used only for generating your personalized risk assessment. 
          We do not store or share your personal health data.
        </Typography>
      </Alert>
    </Container>
  );
};

export default DataCollectionPage;
