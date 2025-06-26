// Type definitions for the Disease Risk Prediction App

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface UserProfile {
  id: number;
  user_id: string;
  // Demographics
  age?: string;
  sex?: string;
  height_cm?: string;
  weight_kg?: string;
  ethnicity?: string;
  // Lifestyle
  diet_type?: string;
  exercise_frequency?: string;
  sleep_hours?: string;
  tobacco_use?: string;
  alcohol_consumption?: string;
  occupation?: string;
  environmental_exposures?: string;
  // Medical history
  past_diagnoses?: string[];
  family_history?: string[];
  current_symptoms?: string[];
  medications?: string[];
  // Completion status
  demographics_complete: boolean;
  lifestyle_complete: boolean;
  medical_history_complete: boolean;
}

export interface LabResult {
  id: number;
  user_id: string;
  test_name: string;
  test_value: string;
  test_unit?: string;
  reference_range?: string;
  test_date: string;
  lab_name?: string;
  doctor_name?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RiskPrediction {
  id: number;
  user_id: string;
  disease_name: string;
  risk_score: string;
  risk_category: 'Low' | 'Medium' | 'High';
  confidence_score?: string;
  model_version: string;
  recommendations?: string[];
  prediction_date: string;
  is_active: boolean;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  full_name?: string;
  data_sharing_consent: boolean;
  marketing_consent: boolean;
}

export interface DemographicsData {
  age: number;
  sex: 'male' | 'female' | 'other';
  height_cm: number;
  weight_kg: number;
  ethnicity: string;
}

export interface LifestyleData {
  diet_type: string;
  exercise_frequency: 'none' | 'light' | 'moderate' | 'heavy';
  sleep_hours: number;
  tobacco_use: 'yes' | 'no';
  alcohol_consumption: 'none' | 'light' | 'moderate' | 'heavy';
  occupation: string;
  environmental_exposures: string[];
}

export interface MedicalHistoryData {
  past_diagnoses: string[];
  family_history: string[];
  current_symptoms: string[];
  medications: string[];
}

export interface LabData {
  cholesterol?: number;
  glucose?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  [key: string]: number | undefined;
}

export interface PredictionResult {
  disease_name: string;
  risk_score: number;
  risk_percentage: string;
  risk_category: 'Low' | 'Medium' | 'High';
  confidence: number;
  recommendations: string[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
  requiresAuth?: boolean;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Education content types
export interface EducationArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  readTime: number;
  lastUpdated: string;
  tags: string[];
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
