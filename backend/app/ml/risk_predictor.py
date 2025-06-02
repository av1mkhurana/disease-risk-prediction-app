"""
Disease Risk Prediction ML Model
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
from typing import Dict, List, Tuple, Any
from datetime import datetime
import os


class DiseaseRiskPredictor:
    """
    Machine Learning model for predicting disease risks
    """
    
    def __init__(self, model_path: str = "ml-models/models"):
        self.model_path = model_path
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.feature_names = []
        self.diseases = ["heart_disease", "diabetes", "cancer"]
        
        # Ensure model directory exists
        os.makedirs(model_path, exist_ok=True)
    
    def prepare_features(self, user_data: Dict[str, Any]) -> np.ndarray:
        """
        Prepare features from user data for prediction
        """
        features = []
        
        # Demographics
        age = float(user_data.get('age', 0))
        sex = 1 if user_data.get('sex', '').lower() == 'male' else 0
        height_cm = float(user_data.get('height_cm', 170))
        weight_kg = float(user_data.get('weight_kg', 70))
        bmi = weight_kg / ((height_cm / 100) ** 2)
        
        # Ethnicity encoding (simplified)
        ethnicity_map = {
            'caucasian': 0, 'african': 1, 'asian': 2, 
            'hispanic': 3, 'other': 4
        }
        ethnicity = ethnicity_map.get(
            user_data.get('ethnicity', '').lower(), 4
        )
        
        features.extend([age, sex, height_cm, weight_kg, bmi, ethnicity])
        
        # Lifestyle factors
        exercise_map = {'none': 0, 'light': 1, 'moderate': 2, 'heavy': 3}
        exercise = exercise_map.get(
            user_data.get('exercise_frequency', '').lower(), 1
        )
        
        sleep_hours = float(user_data.get('sleep_hours', 7))
        tobacco_use = 1 if user_data.get('tobacco_use', '').lower() == 'yes' else 0
        
        alcohol_map = {'none': 0, 'light': 1, 'moderate': 2, 'heavy': 3}
        alcohol = alcohol_map.get(
            user_data.get('alcohol_consumption', '').lower(), 0
        )
        
        features.extend([exercise, sleep_hours, tobacco_use, alcohol])
        
        # Medical history (simplified binary features)
        past_diagnoses = user_data.get('past_diagnoses', [])
        family_history = user_data.get('family_history', [])
        
        # Common conditions
        conditions = [
            'hypertension', 'high_cholesterol', 'obesity', 
            'depression', 'anxiety', 'arthritis'
        ]
        
        for condition in conditions:
            has_condition = 1 if condition in past_diagnoses else 0
            family_has_condition = 1 if condition in family_history else 0
            features.extend([has_condition, family_has_condition])
        
        # Lab results (if available)
        cholesterol = float(user_data.get('cholesterol', 200))
        glucose = float(user_data.get('glucose', 100))
        blood_pressure_systolic = float(user_data.get('blood_pressure_systolic', 120))
        blood_pressure_diastolic = float(user_data.get('blood_pressure_diastolic', 80))
        
        features.extend([cholesterol, glucose, blood_pressure_systolic, blood_pressure_diastolic])
        
        return np.array(features).reshape(1, -1)
    
    def generate_sample_data(self, n_samples: int = 1000) -> pd.DataFrame:
        """
        Generate sample training data for demonstration
        In production, this would be replaced with real medical data
        """
        np.random.seed(42)
        
        data = []
        for _ in range(n_samples):
            # Demographics
            age = np.random.normal(45, 15)
            age = max(18, min(90, age))
            sex = np.random.choice([0, 1])
            height_cm = np.random.normal(170, 10)
            weight_kg = np.random.normal(75, 15)
            bmi = weight_kg / ((height_cm / 100) ** 2)
            ethnicity = np.random.choice([0, 1, 2, 3, 4])
            
            # Lifestyle
            exercise = np.random.choice([0, 1, 2, 3])
            sleep_hours = np.random.normal(7, 1.5)
            sleep_hours = max(4, min(12, sleep_hours))
            tobacco_use = np.random.choice([0, 1], p=[0.8, 0.2])
            alcohol = np.random.choice([0, 1, 2, 3], p=[0.3, 0.4, 0.2, 0.1])
            
            # Medical history (6 conditions, personal and family)
            medical_features = np.random.choice([0, 1], size=12, p=[0.8, 0.2])
            
            # Lab results
            cholesterol = np.random.normal(200, 40)
            glucose = np.random.normal(100, 20)
            bp_systolic = np.random.normal(120, 20)
            bp_diastolic = np.random.normal(80, 10)
            
            # Create feature vector
            features = [
                age, sex, height_cm, weight_kg, bmi, ethnicity,
                exercise, sleep_hours, tobacco_use, alcohol
            ] + medical_features.tolist() + [
                cholesterol, glucose, bp_systolic, bp_diastolic
            ]
            
            # Generate risk labels based on features (simplified logic)
            heart_disease_risk = (
                (age > 50) * 0.3 +
                (sex == 1) * 0.2 +
                (bmi > 30) * 0.2 +
                tobacco_use * 0.3 +
                (bp_systolic > 140) * 0.4 +
                (cholesterol > 240) * 0.3 +
                np.random.normal(0, 0.1)
            )
            
            diabetes_risk = (
                (age > 45) * 0.3 +
                (bmi > 30) * 0.4 +
                (glucose > 126) * 0.5 +
                medical_features[2] * 0.3 +  # obesity history
                np.random.normal(0, 0.1)
            )
            
            cancer_risk = (
                (age > 60) * 0.4 +
                tobacco_use * 0.4 +
                (alcohol > 2) * 0.2 +
                medical_features[1] * 0.2 +  # family history
                np.random.normal(0, 0.1)
            )
            
            # Convert to binary labels
            heart_disease = 1 if heart_disease_risk > 0.5 else 0
            diabetes = 1 if diabetes_risk > 0.5 else 0
            cancer = 1 if cancer_risk > 0.4 else 0
            
            data.append(features + [heart_disease, diabetes, cancer])
        
        # Create column names
        columns = [
            'age', 'sex', 'height_cm', 'weight_kg', 'bmi', 'ethnicity',
            'exercise', 'sleep_hours', 'tobacco_use', 'alcohol'
        ]
        
        # Medical history columns
        conditions = ['hypertension', 'high_cholesterol', 'obesity', 'depression', 'anxiety', 'arthritis']
        for condition in conditions:
            columns.extend([f'{condition}_personal', f'{condition}_family'])
        
        columns.extend(['cholesterol', 'glucose', 'bp_systolic', 'bp_diastolic'])
        columns.extend(['heart_disease', 'diabetes', 'cancer'])
        
        return pd.DataFrame(data, columns=columns)
    
    def train_models(self):
        """
        Train disease risk prediction models
        """
        print("Generating sample training data...")
        df = self.generate_sample_data(2000)
        
        # Prepare features and targets
        feature_columns = [col for col in df.columns if col not in self.diseases]
        X = df[feature_columns]
        self.feature_names = feature_columns
        
        # Train models for each disease
        for disease in self.diseases:
            print(f"Training model for {disease}...")
            
            y = df[disease]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train Random Forest model
            model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                class_weight='balanced'
            )
            model.fit(X_train_scaled, y_train)
            
            # Evaluate model
            y_pred = model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            print(f"{disease} model accuracy: {accuracy:.3f}")
            
            # Save model and scaler
            self.models[disease] = model
            self.scalers[disease] = scaler
            
            # Save to disk
            joblib.dump(model, f"{self.model_path}/{disease}_model.pkl")
            joblib.dump(scaler, f"{self.model_path}/{disease}_scaler.pkl")
        
        # Save feature names
        with open(f"{self.model_path}/feature_names.json", 'w') as f:
            json.dump(self.feature_names, f)
        
        print("Model training completed!")
    
    def load_models(self):
        """
        Load trained models from disk
        """
        try:
            # Load feature names
            with open(f"{self.model_path}/feature_names.json", 'r') as f:
                self.feature_names = json.load(f)
            
            # Load models and scalers
            for disease in self.diseases:
                model_file = f"{self.model_path}/{disease}_model.pkl"
                scaler_file = f"{self.model_path}/{disease}_scaler.pkl"
                
                if os.path.exists(model_file) and os.path.exists(scaler_file):
                    self.models[disease] = joblib.load(model_file)
                    self.scalers[disease] = joblib.load(scaler_file)
                else:
                    print(f"Model files for {disease} not found. Training new models...")
                    self.train_models()
                    break
            
            print("Models loaded successfully!")
            
        except Exception as e:
            print(f"Error loading models: {e}")
            print("Training new models...")
            self.train_models()
    
    def predict_risk(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict disease risks for a user
        """
        if not self.models:
            self.load_models()
        
        # Prepare features
        features = self.prepare_features(user_data)
        
        predictions = {}
        
        for disease in self.diseases:
            if disease in self.models and disease in self.scalers:
                # Scale features
                features_scaled = self.scalers[disease].transform(features)
                
                # Get prediction probability
                risk_prob = self.models[disease].predict_proba(features_scaled)[0][1]
                
                # Categorize risk
                if risk_prob < 0.3:
                    risk_category = "Low"
                elif risk_prob < 0.7:
                    risk_category = "Medium"
                else:
                    risk_category = "High"
                
                predictions[disease] = {
                    "risk_score": float(risk_prob),
                    "risk_percentage": f"{risk_prob * 100:.1f}%",
                    "risk_category": risk_category,
                    "confidence": 0.85  # Simplified confidence score
                }
        
        return predictions
    
    def get_recommendations(self, predictions: Dict[str, Any], user_data: Dict[str, Any]) -> Dict[str, List[str]]:
        """
        Generate personalized recommendations based on predictions
        """
        recommendations = {}
        
        for disease, prediction in predictions.items():
            recs = []
            risk_score = prediction["risk_score"]
            
            if disease == "heart_disease":
                if risk_score > 0.5:
                    recs.extend([
                        "Consider regular cardiovascular exercise (30 min, 5 days/week)",
                        "Maintain a heart-healthy diet low in saturated fats",
                        "Monitor blood pressure regularly",
                        "Consult with a cardiologist for comprehensive evaluation"
                    ])
                if user_data.get('tobacco_use') == 'yes':
                    recs.append("Quit smoking - this is the single most important step for heart health")
                if float(user_data.get('cholesterol', 200)) > 240:
                    recs.append("Work with your doctor to manage cholesterol levels")
            
            elif disease == "diabetes":
                if risk_score > 0.5:
                    recs.extend([
                        "Maintain a balanced diet with controlled carbohydrate intake",
                        "Engage in regular physical activity to improve insulin sensitivity",
                        "Monitor blood glucose levels regularly",
                        "Maintain a healthy weight (BMI 18.5-24.9)"
                    ])
                if float(user_data.get('weight_kg', 70)) / ((float(user_data.get('height_cm', 170)) / 100) ** 2) > 30:
                    recs.append("Focus on gradual, sustainable weight loss")
            
            elif disease == "cancer":
                if risk_score > 0.4:
                    recs.extend([
                        "Follow recommended cancer screening guidelines for your age",
                        "Maintain a diet rich in fruits and vegetables",
                        "Limit processed meat and alcohol consumption",
                        "Protect skin from excessive sun exposure"
                    ])
                if user_data.get('tobacco_use') == 'yes':
                    recs.append("Quit smoking to significantly reduce cancer risk")
            
            # General recommendations for all
            if risk_score > 0.3:
                recs.extend([
                    "Schedule regular check-ups with your healthcare provider",
                    "Maintain a healthy sleep schedule (7-9 hours per night)",
                    "Manage stress through relaxation techniques or counseling"
                ])
            
            recommendations[disease] = recs
        
        return recommendations


# Initialize global predictor instance
risk_predictor = DiseaseRiskPredictor()
