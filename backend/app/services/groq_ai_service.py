"""
Groq AI Service for Disease Risk Prediction using Llama-4
Replaces static ML models with dynamic AI-powered analysis
"""

import json
import logging
from typing import Dict, List, Any, Optional
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)


class GroqAIService:
    """
    Service for interacting with Groq AI API using Llama-4 model
    for dynamic disease risk prediction based on user assessments
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "meta-llama/llama-4-scout-17b-16e-instruct"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    
    async def predict_disease_risks(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate disease risk predictions using Llama-4 analysis
        
        Args:
            user_data: Complete user assessment data
            
        Returns:
            Dict containing risk predictions, recommendations, and confidence scores
        """
        try:
            # Create comprehensive prompt for AI analysis
            prompt = self._create_assessment_prompt(user_data)
            
            # Make API call to Groq
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.base_url,
                    headers=self.headers,
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": self._get_system_prompt()
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.3,  # Lower temperature for more consistent medical predictions
                        "max_tokens": 2000,
                        "response_format": {"type": "json_object"}
                    }
                )
            
            if response.status_code != 200:
                logger.error(f"Groq API error: {response.status_code} - {response.text}")
                raise Exception(f"Groq API request failed: {response.status_code}")
            
            # Parse AI response
            ai_response = response.json()
            content = ai_response["choices"][0]["message"]["content"]
            
            # Parse JSON response from AI
            predictions = json.loads(content)
            
            # Validate and format predictions
            formatted_predictions = self._format_predictions(predictions)
            
            logger.info(f"Successfully generated AI predictions for user")
            return formatted_predictions
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            return self._get_fallback_predictions()
        except Exception as e:
            logger.error(f"Groq AI prediction error: {e}")
            return self._get_fallback_predictions()
    
    def _get_system_prompt(self) -> str:
        """
        System prompt to establish AI's role as a medical risk assessment expert
        """
        return """You are a medical AI specialist focused on disease risk assessment. Your role is to analyze comprehensive health assessments and provide accurate disease risk predictions.

Key Guidelines:
- Analyze ALL provided health data including demographics, lifestyle, medical history, family history, and lab results
- Provide risk percentages (0-100%) for heart disease, diabetes, and cancer
- Consider ethnicity-specific risk factors and population health data
- Generate personalized, actionable recommendations
- Assign confidence scores based on data completeness and risk factor clarity
- Use evidence-based medical knowledge for assessments
- Be conservative with high-risk predictions - require strong evidence
- Always respond in valid JSON format

Your predictions should be:
- Medically sound and evidence-based
- Personalized to the individual's specific profile
- Culturally sensitive when considering ethnicity
- Actionable with specific recommendations
- Appropriately confident based on available data"""

    def _create_assessment_prompt(self, user_data: Dict[str, Any]) -> str:
        """
        Create comprehensive prompt with user assessment data
        """
        # Extract and format user data
        demographics = self._format_demographics(user_data)
        lifestyle = self._format_lifestyle(user_data)
        medical_history = self._format_medical_history(user_data)
        lab_results = self._format_lab_results(user_data.get('lab_results', []))
        
        prompt = f"""Please analyze this comprehensive health assessment and provide disease risk predictions:

DEMOGRAPHICS:
{demographics}

LIFESTYLE FACTORS:
{lifestyle}

MEDICAL HISTORY:
{medical_history}

LABORATORY RESULTS:
{lab_results}

Please provide a detailed risk assessment with the following JSON structure:

{{
    "heart_disease": {{
        "risk_percentage": <0-100>,
        "risk_category": "<Low|Medium|High>",
        "confidence_score": <0-100>,
        "key_risk_factors": ["factor1", "factor2", "factor3"],
        "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"]
    }},
    "diabetes": {{
        "risk_percentage": <0-100>,
        "risk_category": "<Low|Medium|High>",
        "confidence_score": <0-100>,
        "key_risk_factors": ["factor1", "factor2", "factor3"],
        "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"]
    }},
    "cancer": {{
        "risk_percentage": <0-100>,
        "risk_category": "<Low|Medium|High>",
        "confidence_score": <0-100>,
        "key_risk_factors": ["factor1", "factor2", "factor3"],
        "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"]
    }},
    "overall_assessment": {{
        "health_score": <0-100>,
        "primary_concerns": ["concern1", "concern2"],
        "positive_factors": ["factor1", "factor2"],
        "immediate_actions": ["action1", "action2", "action3"]
    }},
    "analysis_notes": "Brief explanation of the assessment methodology and key considerations"
}}

Consider:
- Age and gender-specific risk patterns
- Ethnicity-specific disease prevalence and risk factors
- BMI and its relationship to disease risk
- Family history genetic predisposition
- Lifestyle factor interactions
- Lab result interpretations and clinical significance
- Current symptoms and their implications
- Medication effects on risk profiles

Provide specific, actionable recommendations tailored to this individual's profile."""

        return prompt
    
    def _format_demographics(self, user_data: Dict[str, Any]) -> str:
        """Format demographic information for AI prompt"""
        age = user_data.get('age', 'Not provided')
        sex = user_data.get('sex', 'Not provided')
        ethnicity = user_data.get('ethnicity', 'Not provided')
        height_cm = user_data.get('height_cm', 'Not provided')
        weight_kg = user_data.get('weight_kg', 'Not provided')
        
        # Calculate BMI if height and weight available
        bmi = "Not calculated"
        if height_cm and weight_kg:
            try:
                height_m = float(height_cm) / 100
                bmi = round(float(weight_kg) / (height_m ** 2), 1)
            except (ValueError, ZeroDivisionError):
                pass
        
        return f"""- Age: {age} years
- Sex: {sex}
- Ethnicity: {ethnicity}
- Height: {height_cm} cm
- Weight: {weight_kg} kg
- BMI: {bmi}"""
    
    def _format_lifestyle(self, user_data: Dict[str, Any]) -> str:
        """Format lifestyle information for AI prompt"""
        diet_type = user_data.get('diet_type', 'Not provided')
        exercise_frequency = user_data.get('exercise_frequency', 'Not provided')
        sleep_hours = user_data.get('sleep_hours', 'Not provided')
        tobacco_use = user_data.get('tobacco_use', 'Not provided')
        alcohol_consumption = user_data.get('alcohol_consumption', 'Not provided')
        occupation = user_data.get('occupation', 'Not provided')
        environmental_exposures = user_data.get('environmental_exposures', 'Not provided')
        
        return f"""- Diet Type: {diet_type}
- Exercise Frequency: {exercise_frequency}
- Sleep Hours: {sleep_hours} per night
- Tobacco Use: {tobacco_use}
- Alcohol Consumption: {alcohol_consumption}
- Occupation: {occupation}
- Environmental Exposures: {environmental_exposures}"""
    
    def _format_medical_history(self, user_data: Dict[str, Any]) -> str:
        """Format medical history for AI prompt"""
        past_diagnoses = user_data.get('past_diagnoses', [])
        family_history = user_data.get('family_history', [])
        current_symptoms = user_data.get('current_symptoms', [])
        medications = user_data.get('medications', [])
        
        past_diagnoses_str = ', '.join(past_diagnoses) if past_diagnoses else 'None reported'
        family_history_str = ', '.join(family_history) if family_history else 'None reported'
        current_symptoms_str = ', '.join(current_symptoms) if current_symptoms else 'None reported'
        medications_str = ', '.join(medications) if medications else 'None reported'
        
        return f"""- Past Diagnoses: {past_diagnoses_str}
- Family History: {family_history_str}
- Current Symptoms: {current_symptoms_str}
- Current Medications: {medications_str}"""
    
    def _format_lab_results(self, lab_results: List[Dict[str, Any]]) -> str:
        """Format laboratory results for AI prompt"""
        if not lab_results:
            return "No laboratory results provided"
        
        formatted_results = []
        for lab in lab_results:
            test_name = lab.get('test_name', 'Unknown test')
            test_value = lab.get('test_value', 'No value')
            test_unit = lab.get('test_unit', '')
            test_date = lab.get('test_date', 'Unknown date')
            reference_range = lab.get('reference_range', '')
            
            result_str = f"- {test_name}: {test_value} {test_unit}"
            if reference_range:
                result_str += f" (Reference: {reference_range})"
            result_str += f" [{test_date}]"
            formatted_results.append(result_str)
        
        return '\n'.join(formatted_results)
    
    def _format_predictions(self, ai_predictions: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format AI predictions into the expected response structure
        """
        formatted = {
            "predictions": [],
            "model_version": "Llama-4-Groq-AI",
            "prediction_date": datetime.utcnow().isoformat(),
            "confidence_scores": {}
        }
        
        # Process each disease prediction
        for disease in ["heart_disease", "diabetes", "cancer"]:
            if disease in ai_predictions:
                disease_data = ai_predictions[disease]
                
                prediction = {
                    "disease_name": disease.replace("_", " ").title(),
                    "risk_score": disease_data.get("risk_percentage", 0),
                    "risk_category": disease_data.get("risk_category", "Low"),
                    "confidence_score": disease_data.get("confidence_score", 50),
                    "recommendations": disease_data.get("recommendations", []),
                    "key_risk_factors": disease_data.get("key_risk_factors", [])
                }
                
                formatted["predictions"].append(prediction)
                formatted["confidence_scores"][disease] = disease_data.get("confidence_score", 50) / 100
        
        # Add overall assessment if available
        if "overall_assessment" in ai_predictions:
            formatted["overall_assessment"] = ai_predictions["overall_assessment"]
        
        # Add analysis notes if available
        if "analysis_notes" in ai_predictions:
            formatted["analysis_notes"] = ai_predictions["analysis_notes"]
        
        return formatted
    
    def _get_fallback_predictions(self) -> Dict[str, Any]:
        """
        Provide fallback predictions if AI service fails
        """
        return {
            "predictions": [
                {
                    "disease_name": "Heart Disease",
                    "risk_score": 15,
                    "risk_category": "Low",
                    "confidence_score": 30,
                    "recommendations": [
                        "AI service temporarily unavailable",
                        "Please consult with your healthcare provider",
                        "Maintain a healthy lifestyle with regular exercise",
                        "Follow a balanced diet low in saturated fats",
                        "Monitor blood pressure regularly"
                    ],
                    "key_risk_factors": ["Service unavailable"]
                },
                {
                    "disease_name": "Diabetes",
                    "risk_score": 12,
                    "risk_category": "Low",
                    "confidence_score": 30,
                    "recommendations": [
                        "AI service temporarily unavailable",
                        "Please consult with your healthcare provider",
                        "Maintain healthy blood sugar levels",
                        "Exercise regularly and maintain healthy weight",
                        "Monitor carbohydrate intake"
                    ],
                    "key_risk_factors": ["Service unavailable"]
                },
                {
                    "disease_name": "Cancer",
                    "risk_score": 10,
                    "risk_category": "Low",
                    "confidence_score": 30,
                    "recommendations": [
                        "AI service temporarily unavailable",
                        "Please consult with your healthcare provider",
                        "Follow recommended cancer screening guidelines",
                        "Maintain a healthy lifestyle",
                        "Avoid tobacco and limit alcohol consumption"
                    ],
                    "key_risk_factors": ["Service unavailable"]
                }
            ],
            "model_version": "Fallback-System",
            "prediction_date": datetime.utcnow().isoformat(),
            "confidence_scores": {
                "heart_disease": 0.3,
                "diabetes": 0.3,
                "cancer": 0.3
            },
            "overall_assessment": {
                "health_score": 75,
                "primary_concerns": ["AI service unavailable"],
                "positive_factors": ["Seeking health assessment"],
                "immediate_actions": ["Consult healthcare provider", "Maintain healthy lifestyle"]
            },
            "analysis_notes": "AI prediction service is temporarily unavailable. These are generic recommendations. Please consult with your healthcare provider for personalized medical advice."
        }
    
    async def generate_health_reasoning(self, user_data: Dict[str, Any], algorithm_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate Llama-4 reasoning for health score and lifestyle improvements
        """
        try:
            health_score = algorithm_results.get('health_score', 75)
            life_expectancy = algorithm_results.get('life_expectancy', {})
            risk_assessments = algorithm_results.get('risk_assessments', [])
            
            # Create prompt for health reasoning
            prompt = f"""Based on this health assessment, please provide detailed reasoning and personalized insights:

HEALTH SCORE: {health_score}/100
LIFE EXPECTANCY: {life_expectancy.get('current_life_expectancy', 'Unknown')} years
RISK ASSESSMENTS: {[f"{r['disease_name']}: {r['risk_score']}%" for r in risk_assessments]}

USER PROFILE:
- Age: {user_data.get('age', 'Unknown')}
- Sex: {user_data.get('sex', 'Unknown')}
- Smoking: {user_data.get('tobacco_use', 'Unknown')}
- Alcohol: {user_data.get('alcohol_consumption', 'Unknown')}
- Exercise: {user_data.get('exercise_frequency', 'Unknown')}
- BMI: {self._calculate_bmi(user_data)}

Please provide a JSON response with:
{{
    "health_score_reasoning": "Detailed explanation of why this health score was calculated, mentioning specific factors",
    "lifestyle_improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3", "specific improvement 4", "specific improvement 5"],
    "personalized_insights": ["insight about their specific situation", "insight about their risk factors", "insight about their positive factors"]
}}

Focus on:
1. Why their health score is what it is
2. Specific lifestyle changes that would improve their score
3. Personal insights based on their unique profile"""

            # Make API call to Groq for reasoning
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.base_url,
                    headers=self.headers,
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a medical AI that provides clear, personalized health insights and reasoning. Always respond in valid JSON format."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.4,
                        "max_tokens": 1000,
                        "response_format": {"type": "json_object"}
                    }
                )
            
            if response.status_code == 200:
                ai_response = response.json()
                content = ai_response["choices"][0]["message"]["content"]
                return json.loads(content)
            else:
                raise Exception(f"Groq API error: {response.status_code}")
                
        except Exception as e:
            logger.warning(f"Llama-4 reasoning failed: {e}")
            # Return fallback reasoning
            return {
                "health_score_reasoning": f"Your health score of {algorithm_results.get('health_score', 75)}/100 reflects your current lifestyle factors, age, and risk assessments. This score considers your smoking status, exercise habits, alcohol consumption, and other health indicators.",
                "lifestyle_improvements": [
                    "Increase physical activity to at least 150 minutes per week",
                    "Maintain a balanced diet rich in fruits and vegetables",
                    "Ensure adequate sleep (7-9 hours nightly)",
                    "Manage stress through relaxation techniques",
                    "Schedule regular health check-ups"
                ],
                "personalized_insights": [
                    "Your assessment shows areas for potential improvement",
                    "Focus on the highest-impact lifestyle changes first",
                    "Small, consistent changes can lead to significant health improvements"
                ]
            }
    
    def _calculate_bmi(self, user_data: Dict[str, Any]) -> str:
        """Calculate BMI from user data"""
        try:
            height_cm = float(user_data.get('height_cm', 0))
            weight_kg = float(user_data.get('weight_kg', 0))
            if height_cm > 0 and weight_kg > 0:
                height_m = height_cm / 100
                bmi = weight_kg / (height_m ** 2)
                return f"{bmi:.1f}"
            return "Unknown"
        except (ValueError, ZeroDivisionError):
            return "Unknown"
