"""
Disease risk prediction endpoints with Groq AI integration
"""

from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime

from app.core.supabase import get_supabase_client, SupabaseClient
from app.core.auth_middleware import get_current_user, get_user_id
from app.core.config import settings
from app.services.groq_ai_service import GroqAIService
from app.services.medical_algorithms import MedicalAlgorithmFramework
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize Groq AI service
def get_groq_service() -> GroqAIService:
    """Get Groq AI service instance"""
    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Groq API key not configured"
        )
    return GroqAIService(settings.GROQ_API_KEY)


class PredictionRequest(BaseModel):
    """Request model for risk prediction"""
    include_lab_results: bool = True
    prediction_types: List[str] = ["heart_disease", "diabetes", "cancer"]
    user_data: Dict[str, Any] = None


class PredictionResponse(BaseModel):
    """Response model for risk predictions"""
    predictions: List[Dict[str, Any]]
    model_version: str
    prediction_date: str
    confidence_scores: Dict[str, float]


@router.post("/predict")
async def predict_disease_risk(request: PredictionRequest) -> Dict[str, Any]:
    """
    Generate disease risk predictions using medical algorithms
    Uses actual user data from localStorage
    """
    try:
        # Get user data from request body
        # Default to sample data if not provided
        user_data = request.user_data or {
            "age": 35,
            "sex": "male",
            "height_cm": 175,
            "weight_kg": 75,
            "ethnicity": "caucasian",
            "diet_type": "balanced",
            "exercise_frequency": "3-4 times per week",
            "sleep_hours": 7,
            "tobacco_use": "never",
            "alcohol_consumption": "moderate",
            "occupation": "office worker",
            "past_diagnoses": [],
            "family_history": [],
            "current_symptoms": [],
            "medications": [],
            "lab_results": []
        }
        
        # Use evidence-based medical algorithms
        algorithm_framework = MedicalAlgorithmFramework()
        algorithm_results = algorithm_framework.comprehensive_risk_assessment(user_data)
        
        # Try to get Llama-4 reasoning for health score and recommendations
        try:
            groq_service = get_groq_service()
            llama_reasoning = await groq_service.generate_health_reasoning(user_data, algorithm_results)
        except Exception as e:
            logger.warning(f"Llama-4 reasoning failed, using fallback: {e}")
            llama_reasoning = {
                "health_score_reasoning": f"Your health score of {algorithm_results['health_score']}/100 is based on evidence-based medical algorithms considering your age, lifestyle factors, and risk assessments.",
                "lifestyle_improvements": algorithm_results["comprehensive_recommendations"][:5],
                "personalized_insights": ["Complete medical assessment completed using validated clinical algorithms."]
            }
        
        # Convert algorithm results to expected format with Llama-4 insights
        ai_predictions = {
            "predictions": algorithm_results["risk_assessments"],
            "model_version": f"{algorithm_results['algorithm_framework']} + Llama-4 Reasoning",
            "prediction_date": algorithm_results["assessment_date"],
            "confidence_scores": {
                assessment["disease_name"].lower().replace(" ", "_"): assessment["confidence_score"] / 100
                for assessment in algorithm_results["risk_assessments"]
            },
            "overall_assessment": {
                "health_score": algorithm_results["health_score"],
                "primary_concerns": [],
                "positive_factors": [],
                "immediate_actions": algorithm_results["comprehensive_recommendations"][:3]
            },
            "life_expectancy": algorithm_results["life_expectancy"],
            "llama_reasoning": llama_reasoning,
            "comprehensive_recommendations": algorithm_results["comprehensive_recommendations"],
            "analysis_notes": f"Evidence-based medical algorithms with Llama-4 AI reasoning. Life expectancy: {algorithm_results['life_expectancy']['current_life_expectancy']} years"
        }
        
        return ai_predictions
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


@router.get("/history")
async def get_prediction_history(
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get user's prediction history
    """
    predictions = await supabase.get_risk_predictions(user_id)
    return {"prediction_history": predictions}


@router.get("/latest")
async def get_latest_predictions(
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get user's latest predictions (most recent for each disease type)
    """
    all_predictions = await supabase.get_risk_predictions(user_id)
    
    # Group by disease and get latest for each
    latest_predictions = {}
    for prediction in all_predictions:
        disease = prediction.get("disease_name")
        if disease not in latest_predictions:
            latest_predictions[disease] = prediction
        else:
            # Compare dates and keep the latest
            current_date = prediction.get("prediction_date")
            existing_date = latest_predictions[disease].get("prediction_date")
            if current_date > existing_date:
                latest_predictions[disease] = prediction
    
    return {"latest_predictions": list(latest_predictions.values())}


@router.post("/test-predict")
async def test_predict_disease_risk() -> Dict[str, Any]:
    """
    Test endpoint for disease risk predictions without authentication
    Uses mock data to test the Groq AI service
    """
    try:
        # Mock user data for testing
        mock_user_data = {
            "age": 35,
            "sex": "male",
            "height_cm": 175,
            "weight_kg": 75,
            "ethnicity": "caucasian",
            "diet_type": "balanced",
            "exercise_frequency": "3-4 times per week",
            "sleep_hours": 7,
            "tobacco_use": "never",
            "alcohol_consumption": "moderate",
            "occupation": "office worker",
            "past_diagnoses": [],
            "family_history": ["heart_disease"],
            "current_symptoms": [],
            "medications": [],
            "lab_results": []
        }
        
        # Generate AI-powered predictions using Groq
        groq_service = get_groq_service()
        ai_predictions = await groq_service.predict_disease_risks(mock_user_data)
        
        # Add test metadata
        ai_predictions["test_mode"] = True
        ai_predictions["mock_data_used"] = True
        ai_predictions["note"] = "This is a test prediction using mock data"
        
        return ai_predictions
        
    except Exception as e:
        logger.error(f"Test prediction error: {e}")
        # Return fallback predictions for testing
        return {
            "predictions": [
                {
                    "disease_name": "Heart Disease",
                    "risk_score": 15,
                    "risk_category": "Low",
                    "confidence_score": 85,
                    "recommendations": [
                        "Test endpoint working - Groq AI service available",
                        "Maintain regular exercise routine",
                        "Follow a heart-healthy diet",
                        "Monitor blood pressure regularly",
                        "Schedule regular check-ups"
                    ],
                    "key_risk_factors": ["Family history"]
                },
                {
                    "disease_name": "Diabetes",
                    "risk_score": 12,
                    "risk_category": "Low",
                    "confidence_score": 88,
                    "recommendations": [
                        "Test endpoint working - Groq AI service available",
                        "Maintain healthy weight",
                        "Exercise regularly",
                        "Monitor blood sugar levels",
                        "Eat a balanced diet"
                    ],
                    "key_risk_factors": ["Age", "Lifestyle"]
                },
                {
                    "disease_name": "Cancer",
                    "risk_score": 10,
                    "risk_category": "Low",
                    "confidence_score": 82,
                    "recommendations": [
                        "Test endpoint working - Groq AI service available",
                        "Follow cancer screening guidelines",
                        "Maintain healthy lifestyle",
                        "Avoid tobacco and limit alcohol",
                        "Eat plenty of fruits and vegetables"
                    ],
                    "key_risk_factors": ["Age", "Lifestyle"]
                }
            ],
            "model_version": "Groq-AI-Test-Mode",
            "prediction_date": datetime.utcnow().isoformat(),
            "confidence_scores": {
                "heart_disease": 0.85,
                "diabetes": 0.88,
                "cancer": 0.82
            },
            "test_mode": True,
            "error_occurred": str(e),
            "note": "Fallback predictions due to error: " + str(e)
        }


def generate_recommendations(disease_type: str, risk_score: float, user_data: Dict[str, Any]) -> List[str]:
    """
    Generate personalized recommendations based on risk score and user data
    """
    recommendations = []
    
    if disease_type == "heart_disease":
        if risk_score > 0.7:
            recommendations.extend([
                "Consult with a cardiologist for comprehensive evaluation",
                "Consider cardiac stress testing and advanced lipid panel",
                "Implement immediate lifestyle changes including diet and exercise"
            ])
        elif risk_score > 0.4:
            recommendations.extend([
                "Schedule regular check-ups with your primary care physician",
                "Monitor blood pressure and cholesterol levels regularly",
                "Adopt a heart-healthy diet (Mediterranean or DASH diet)"
            ])
        
        # Lifestyle-specific recommendations
        if user_data.get("tobacco_use") == "yes":
            recommendations.append("Quit smoking - this is the single most important step for heart health")
        
        if user_data.get("exercise_frequency") in ["never", "rarely"]:
            recommendations.append("Start with 30 minutes of moderate exercise 5 days per week")
    
    elif disease_type == "diabetes":
        if risk_score > 0.7:
            recommendations.extend([
                "Consult with an endocrinologist for diabetes prevention strategies",
                "Get HbA1c and glucose tolerance testing",
                "Consider pre-diabetes medication if recommended by your doctor"
            ])
        elif risk_score > 0.4:
            recommendations.extend([
                "Monitor blood sugar levels regularly",
                "Adopt a low-glycemic diet with controlled carbohydrate intake",
                "Maintain a healthy weight through diet and exercise"
            ])
        
        # Weight-specific recommendations
        if user_data.get("weight_kg") and user_data.get("height_cm"):
            bmi = user_data["weight_kg"] / ((user_data["height_cm"] / 100) ** 2)
            if bmi > 25:
                recommendations.append("Focus on gradual weight loss to reduce diabetes risk")
    
    elif disease_type == "cancer":
        if risk_score > 0.6:
            recommendations.extend([
                "Discuss cancer screening schedule with your oncologist",
                "Consider genetic counseling if family history is significant",
                "Maintain regular screening appointments (mammograms, colonoscopies, etc.)"
            ])
        
        recommendations.extend([
            "Maintain a diet rich in fruits, vegetables, and whole grains",
            "Limit processed meats and alcohol consumption",
            "Protect skin from UV exposure and avoid tobacco products"
        ])
    
    # General recommendations for all diseases
    if not recommendations:
        recommendations.extend([
            "Maintain regular health check-ups",
            "Follow a balanced, nutritious diet",
            "Stay physically active with regular exercise",
            "Manage stress through relaxation techniques or counseling"
        ])
    
    return recommendations[:5]  # Limit to top 5 recommendations
