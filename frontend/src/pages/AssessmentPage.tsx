import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Fade,
  Slide,
  Zoom,
  CircularProgress,
  Avatar,
  StepConnector
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  LocalHospital,
  Psychology,
  Warning,
  CheckCircle,
  TrendingUp,
  Favorite
} from '@mui/icons-material';

interface PersonalInfo {
  age: number;
  gender: string;
  height: number;
  weight: number;
  ethnicity: string;
}

interface LifestyleFactors {
  smoking: string;
  alcohol: string;
  exercise: string;
  diet: string;
  sleep: number;
  stress: string;
}

interface MedicalHistory {
  familyHistory: string[];
  currentConditions: string[];
  medications: string[];
  allergies: string[];
}

interface RiskAssessment {
  overallRisk: 'Low' | 'Moderate' | 'High' | 'Very High';
  riskScore: number;
  primaryRisks: string[];
  recommendations: string[];
  nextSteps: string[];
}

const steps = ['Personal Information', 'Lifestyle Factors', 'Medical History', 'Risk Assessment'];

const AssessmentPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    age: 30,
    gender: '',
    height: 170,
    weight: 70,
    ethnicity: ''
  });
  
  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleFactors>({
    smoking: '',
    alcohol: '',
    exercise: '',
    diet: '',
    sleep: 7,
    stress: ''
  });
  
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    familyHistory: [],
    currentConditions: [],
    medications: [],
    allergies: []
  });
  
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateBMI = () => {
    const heightInMeters = personalInfo.height / 100;
    return (personalInfo.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getAIFeedback = async (userProfile: any): Promise<string[]> => {
    try {
      const prompt = `You are a medical AI assistant providing health risk analysis. Based on the following health profile, provide 3-5 specific, actionable recommendations:

Age: ${userProfile.age}
Gender: ${userProfile.gender}
BMI: ${userProfile.bmi}
Smoking: ${userProfile.smoking}
Exercise: ${userProfile.exercise}
Diet: ${userProfile.diet}
Sleep: ${userProfile.sleep} hours
Stress: ${userProfile.stress}
Family History: ${userProfile.familyHistory.join(', ') || 'None'}
Current Conditions: ${userProfile.currentConditions.join(', ') || 'None'}
Medications: ${userProfile.medications.join(', ') || 'None'}

Provide specific, personalized recommendations focusing on the highest risk factors. Each recommendation should be actionable and specific to this person's profile. Format as a simple numbered list without any markdown formatting, bold text, or special characters. Just plain text recommendations.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI feedback');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      // Parse the numbered list response and clean markdown formatting
      const recommendations = aiResponse
        .split('\n')
        .filter(line => line.trim() && /^\d+\./.test(line.trim()))
        .map(line => {
          // Remove numbering
          let cleaned = line.replace(/^\d+\.\s*/, '').trim();
          // Remove markdown bold formatting
          cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
          // Remove markdown italic formatting
          cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
          // Remove trailing colons
          cleaned = cleaned.replace(/:$/, '');
          // Clean up extra spaces
          cleaned = cleaned.replace(/\s+/g, ' ').trim();
          return cleaned;
        })
        .filter(rec => rec.length > 0);

      return recommendations.length > 0 ? recommendations : [
        'Maintain regular health check-ups with your healthcare provider',
        'Focus on a balanced diet rich in fruits and vegetables',
        'Engage in regular physical activity as appropriate for your condition'
      ];
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      return [
        'Consult with your healthcare provider for personalized recommendations',
        'Maintain a healthy lifestyle with balanced nutrition and regular exercise',
        'Monitor your health metrics regularly and track changes over time'
      ];
    }
  };

  const calculateRiskAssessment = async (): Promise<RiskAssessment> => {
    let riskScore = 0;
    const primaryRisks: string[] = [];
    const recommendations: string[] = [];
    const nextSteps: string[] = [];

    // Age factor
    if (personalInfo.age > 65) {
      riskScore += 30;
      primaryRisks.push('Advanced age');
      recommendations.push('Regular comprehensive health screenings');
    } else if (personalInfo.age > 45) {
      riskScore += 15;
      recommendations.push('Annual health check-ups');
    }

    // BMI factor
    const bmi = parseFloat(calculateBMI());
    if (bmi > 30) {
      riskScore += 25;
      primaryRisks.push('Obesity');
      recommendations.push('Weight management program');
      nextSteps.push('Consult with a nutritionist');
    } else if (bmi > 25) {
      riskScore += 10;
      primaryRisks.push('Overweight');
      recommendations.push('Healthy weight maintenance');
    }

    // Smoking factor
    if (lifestyleFactors.smoking === 'current') {
      riskScore += 35;
      primaryRisks.push('Current smoking');
      recommendations.push('Smoking cessation program');
      nextSteps.push('Contact smoking cessation helpline');
    } else if (lifestyleFactors.smoking === 'former') {
      riskScore += 10;
      recommendations.push('Continue smoke-free lifestyle');
    }

    // Exercise factor
    if (lifestyleFactors.exercise === 'none') {
      riskScore += 20;
      primaryRisks.push('Sedentary lifestyle');
      recommendations.push('Start regular physical activity');
      nextSteps.push('Begin with 30 minutes of walking daily');
    } else if (lifestyleFactors.exercise === 'light') {
      riskScore += 5;
      recommendations.push('Increase exercise intensity gradually');
    }

    // Family history factor
    if (medicalHistory.familyHistory.length > 0) {
      riskScore += medicalHistory.familyHistory.length * 10;
      primaryRisks.push('Family history of chronic diseases');
      recommendations.push('Enhanced screening for hereditary conditions');
      nextSteps.push('Discuss family history with your doctor');
    }

    // Current conditions factor
    if (medicalHistory.currentConditions.length > 0) {
      riskScore += medicalHistory.currentConditions.length * 15;
      primaryRisks.push('Existing medical conditions');
      recommendations.push('Regular monitoring of current conditions');
    }

    // Sleep factor
    if (lifestyleFactors.sleep < 6 || lifestyleFactors.sleep > 9) {
      riskScore += 10;
      primaryRisks.push('Poor sleep patterns');
      recommendations.push('Improve sleep hygiene');
    }

    // Stress factor
    if (lifestyleFactors.stress === 'high') {
      riskScore += 15;
      primaryRisks.push('High stress levels');
      recommendations.push('Stress management techniques');
      nextSteps.push('Consider meditation or counseling');
    }

    // Alcohol factor
    if (lifestyleFactors.alcohol === 'heavy') {
      riskScore += 20;
      primaryRisks.push('Heavy alcohol consumption');
      recommendations.push('Reduce alcohol intake');
    }

    // Determine overall risk level
    let overallRisk: 'Low' | 'Moderate' | 'High' | 'Very High';
    if (riskScore < 20) {
      overallRisk = 'Low';
    } else if (riskScore < 50) {
      overallRisk = 'Moderate';
    } else if (riskScore < 80) {
      overallRisk = 'High';
    } else {
      overallRisk = 'Very High';
    }

    // Add general recommendations
    recommendations.push('Maintain a balanced diet rich in fruits and vegetables');
    recommendations.push('Stay hydrated with adequate water intake');
    recommendations.push('Regular preventive health screenings');
    
    nextSteps.push('Schedule appointment with primary care physician');
    nextSteps.push('Create a personalized health improvement plan');

    return {
      overallRisk,
      riskScore: Math.min(riskScore, 100),
      primaryRisks,
      recommendations,
      nextSteps
    };
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        // Get AI feedback first
        const userProfile = {
          age: personalInfo.age,
          gender: personalInfo.gender,
          bmi: calculateBMI(),
          smoking: lifestyleFactors.smoking,
          exercise: lifestyleFactors.exercise,
          diet: lifestyleFactors.diet,
          sleep: lifestyleFactors.sleep,
          stress: lifestyleFactors.stress,
          familyHistory: medicalHistory.familyHistory,
          currentConditions: medicalHistory.currentConditions,
          medications: medicalHistory.medications
        };
        
        const aiFeedback = await getAIFeedback(userProfile);
        const result = await calculateRiskAssessment();
        
        // Replace the generic recommendations with AI-powered ones
        result.recommendations = aiFeedback;
        
        setAssessment(result);
      } catch (error) {
        console.error('Error generating assessment:', error);
        // Fallback to basic assessment if AI fails
        const result = await calculateRiskAssessment();
        setAssessment(result);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setAssessment(null);
    setPersonalInfo({
      age: 30,
      gender: '',
      height: 170,
      weight: 70,
      ethnicity: ''
    });
    setLifestyleFactors({
      smoking: '',
      alcohol: '',
      exercise: '',
      diet: '',
      sleep: 7,
      stress: ''
    });
    setMedicalHistory({
      familyHistory: [],
      currentConditions: [],
      medications: [],
      allergies: []
    });
  };

  const handleArrayChange = (
    field: keyof MedicalHistory,
    value: string,
    checked: boolean
  ) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'success';
      case 'Moderate': return 'warning';
      case 'High': return 'error';
      case 'Very High': return 'error';
      default: return 'default';
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  fontSize: '1.5rem'
                }}
              >
                👤
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
                Personal Information
              </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    inputProps={{ min: 1, max: 120 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, gender: e.target.value }))}
                      row
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    value={personalInfo.height}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    inputProps={{ min: 100, max: 250 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    value={personalInfo.weight}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                    inputProps={{ min: 30, max: 300 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info">
                    BMI: {calculateBMI()} kg/m²
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Ethnicity</FormLabel>
                    <RadioGroup
                      value={personalInfo.ethnicity}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, ethnicity: e.target.value }))}
                    >
                      <FormControlLabel value="caucasian" control={<Radio />} label="Caucasian" />
                      <FormControlLabel value="african" control={<Radio />} label="African American" />
                      <FormControlLabel value="hispanic" control={<Radio />} label="Hispanic/Latino" />
                      <FormControlLabel value="asian" control={<Radio />} label="Asian" />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
          </Box>
        );

      case 1:
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FitnessCenter sx={{ mr: 1 }} />
                <Typography variant="h6">Lifestyle Factors</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Smoking Status</FormLabel>
                    <RadioGroup
                      value={lifestyleFactors.smoking}
                      onChange={(e) => setLifestyleFactors(prev => ({ ...prev, smoking: e.target.value }))}
                    >
                      <FormControlLabel value="never" control={<Radio />} label="Never smoked" />
                      <FormControlLabel value="former" control={<Radio />} label="Former smoker" />
                      <FormControlLabel value="current" control={<Radio />} label="Current smoker" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Alcohol Consumption</FormLabel>
                    <RadioGroup
                      value={lifestyleFactors.alcohol}
                      onChange={(e) => setLifestyleFactors(prev => ({ ...prev, alcohol: e.target.value }))}
                    >
                      <FormControlLabel value="none" control={<Radio />} label="None" />
                      <FormControlLabel value="light" control={<Radio />} label="Light (1-2 drinks/week)" />
                      <FormControlLabel value="moderate" control={<Radio />} label="Moderate (3-7 drinks/week)" />
                      <FormControlLabel value="heavy" control={<Radio />} label="Heavy (8+ drinks/week)" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Exercise Frequency</FormLabel>
                    <RadioGroup
                      value={lifestyleFactors.exercise}
                      onChange={(e) => setLifestyleFactors(prev => ({ ...prev, exercise: e.target.value }))}
                    >
                      <FormControlLabel value="none" control={<Radio />} label="No regular exercise" />
                      <FormControlLabel value="light" control={<Radio />} label="Light (1-2 times/week)" />
                      <FormControlLabel value="moderate" control={<Radio />} label="Moderate (3-4 times/week)" />
                      <FormControlLabel value="heavy" control={<Radio />} label="Heavy (5+ times/week)" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Diet Quality</FormLabel>
                    <RadioGroup
                      value={lifestyleFactors.diet}
                      onChange={(e) => setLifestyleFactors(prev => ({ ...prev, diet: e.target.value }))}
                    >
                      <FormControlLabel value="poor" control={<Radio />} label="Poor (fast food, processed foods)" />
                      <FormControlLabel value="fair" control={<Radio />} label="Fair (mixed diet)" />
                      <FormControlLabel value="good" control={<Radio />} label="Good (balanced, some fruits/vegetables)" />
                      <FormControlLabel value="excellent" control={<Radio />} label="Excellent (Mediterranean-style, lots of fruits/vegetables)" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Average Sleep Hours per Night"
                    type="number"
                    value={lifestyleFactors.sleep}
                    onChange={(e) => setLifestyleFactors(prev => ({ ...prev, sleep: parseInt(e.target.value) }))}
                    inputProps={{ min: 3, max: 12 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Stress Level</FormLabel>
                    <RadioGroup
                      value={lifestyleFactors.stress}
                      onChange={(e) => setLifestyleFactors(prev => ({ ...prev, stress: e.target.value }))}
                    >
                      <FormControlLabel value="low" control={<Radio />} label="Low" />
                      <FormControlLabel value="moderate" control={<Radio />} label="Moderate" />
                      <FormControlLabel value="high" control={<Radio />} label="High" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalHospital sx={{ mr: 1 }} />
                <Typography variant="h6">Medical History</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Family History (check all that apply):
                  </Typography>
                  {['Heart Disease', 'Diabetes', 'Cancer', 'High Blood Pressure', 'Stroke', 'Mental Health Issues'].map((condition) => (
                    <FormControlLabel
                      key={condition}
                      control={
                        <Checkbox
                          checked={medicalHistory.familyHistory.includes(condition)}
                          onChange={(e) => handleArrayChange('familyHistory', condition, e.target.checked)}
                        />
                      }
                      label={condition}
                    />
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Medical Conditions (check all that apply):
                  </Typography>
                  {['Diabetes', 'High Blood Pressure', 'Heart Disease', 'Asthma', 'Arthritis', 'Depression/Anxiety'].map((condition) => (
                    <FormControlLabel
                      key={condition}
                      control={
                        <Checkbox
                          checked={medicalHistory.currentConditions.includes(condition)}
                          onChange={(e) => handleArrayChange('currentConditions', condition, e.target.checked)}
                        />
                      }
                      label={condition}
                    />
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Medications (check all that apply):
                  </Typography>
                  {['Blood Pressure Medication', 'Diabetes Medication', 'Cholesterol Medication', 'Antidepressants', 'Pain Medication', 'Vitamins/Supplements'].map((medication) => (
                    <FormControlLabel
                      key={medication}
                      control={
                        <Checkbox
                          checked={medicalHistory.medications.includes(medication)}
                          onChange={(e) => handleArrayChange('medications', medication, e.target.checked)}
                        />
                      }
                      label={medication}
                    />
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 3:
        if (loading) {
          return (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Psychology sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Analyzing Your Health Profile...
                  </Typography>
                  <LinearProgress sx={{ mt: 2, mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Our AI is processing your information to provide personalized risk assessment
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        }

        if (assessment) {
          return (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Favorite sx={{ fontSize: 60, color: getRiskColor(assessment.overallRisk), mb: 2 }} />
                  <Typography variant="h4" gutterBottom>
                    Your Health Risk Assessment
                  </Typography>
                  <Chip
                    label={`${assessment.overallRisk} Risk`}
                    color={getRiskColor(assessment.overallRisk) as any}
                    sx={{ fontSize: '1.1rem', py: 1, px: 2 }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Risk Score: {assessment.riskScore}/100
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={assessment.riskScore}
                      color={getRiskColor(assessment.overallRisk) as any}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Warning sx={{ mr: 1, color: 'warning.main' }} />
                        Primary Risk Factors
                      </Typography>
                      <List>
                        {assessment.primaryRisks.map((risk, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <TrendingUp color="warning" />
                            </ListItemIcon>
                            <ListItemText primary={risk} />
                          </ListItem>
                        ))}
                        {assessment.primaryRisks.length === 0 && (
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText primary="No major risk factors identified" />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                        Recommendations
                      </Typography>
                      <List>
                        {assessment.recommendations.slice(0, 5).map((recommendation, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText primary={recommendation} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Next Steps
                    </Typography>
                    <List>
                      {assessment.nextSteps.map((step, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <TrendingUp color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Disclaimer:</strong> This assessment is for informational purposes only and should not replace professional medical advice. 
                    Please consult with your healthcare provider for personalized medical guidance.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          );
        }

        return null;

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box sx={{ mt: 2, mb: 4 }}>
            {/* Header Section */}
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: 4,
                mb: 4,
                textAlign: 'center'
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  fontSize: '2rem'
                }}
              >
                🏥
              </Avatar>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Health Risk Assessment
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
              >
                Complete this comprehensive assessment to understand your health risks and get personalized AI-powered recommendations
              </Typography>
              
              {/* Progress Indicator */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Step {activeStep + 1} of {steps.length}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(activeStep / (steps.length - 1)) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(103, 126, 234, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            </Paper>

            {/* Enhanced Stepper */}
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: 3,
                mb: 4
              }}
            >
              <Stepper
                activeStep={activeStep}
                sx={{
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#667eea'
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: '#764ba2'
                  }
                }}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontWeight: activeStep === index ? 600 : 400,
                          fontSize: activeStep === index ? '1rem' : '0.875rem'
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            {/* Content Section with Animation */}
            <Slide direction="left" in timeout={600}>
              <Paper
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  mb: 3
                }}
              >
                {renderStepContent(activeStep)}
              </Paper>
            </Slide>

            {/* Navigation Buttons */}
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: 3
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    mr: 2,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(103, 126, 234, 0.1)'
                    }
                  }}
                >
                  ← Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {assessment ? (
                  <Button
                    onClick={handleReset}
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      boxShadow: '0 4px 20px rgba(103, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8, #6a42a0)',
                        boxShadow: '0 6px 25px rgba(103, 126, 234, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🔄 Start New Assessment
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: loading
                        ? 'rgba(103, 126, 234, 0.5)'
                        : 'linear-gradient(45deg, #667eea, #764ba2)',
                      boxShadow: '0 4px 20px rgba(103, 126, 234, 0.3)',
                      '&:hover': {
                        background: loading
                          ? 'rgba(103, 126, 234, 0.5)'
                          : 'linear-gradient(45deg, #5a6fd8, #6a42a0)',
                        boxShadow: '0 6px 25px rgba(103, 126, 234, 0.4)',
                        transform: loading ? 'none' : 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        {activeStep === steps.length - 1 ? '🤖 Generate AI Assessment' : 'Next →'}
                      </>
                    )}
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AssessmentPage;
