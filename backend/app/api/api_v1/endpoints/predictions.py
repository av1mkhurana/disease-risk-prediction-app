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


class PredictionResponse(BaseModel):
    """Response model for risk predictions"""
    predictions: List[Dict[str, Any]]
    model_version: str
    prediction_date: str
    confidence_scores: Dict[str, float]


@router.post("/predict", response_model=PredictionResponse)
async def predict_disease_risk(
    request: PredictionRequest,
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Generate disease risk predictions for the user
    """
    try:
        # Get user profile data
        profile = await supabase.get_user_profile(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User profile not found. Please complete your profile first."
            )
        
        # Check if profile is complete enough for predictions
        if not (profile.get("demographics_complete") and profile.get("lifestyle_complete")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please complete your demographics and lifestyle information first."
            )
        
        # Get lab results if requested
        lab_results = []
        if request.include_lab_results:
            lab_results = await supabase.get_lab_results(user_id)
        
        # Prepare data for Groq AI analysis
        user_data = {
            "age": profile.get("age"),
            "sex": profile.get("sex"),
            "height_cm": profile.get("height_cm"),
            "weight_kg": profile.get("weight_kg"),
            "ethnicity": profile.get("ethnicity"),
            "diet_type": profile.get("diet_type"),
            "exercise_frequency": profile.get("exercise_frequency"),
            "sleep_hours": profile.get("sleep_hours"),
            "tobacco_use": profile.get("tobacco_use"),
            "alcohol_consumption": profile.get("alcohol_consumption"),
            "occupation": profile.get("occupation"),
            "past_diagnoses": profile.get("past_diagnoses", []),
            "family_history": profile.get("family_history", []),
            "current_symptoms": profile.get("current_symptoms", []),
            "medications": profile.get("medications", []),
            "lab_results": lab_results
        }
        
        # Generate AI-powered predictions using Groq
        groq_service = get_groq_service()
        ai_predictions = await groq_service.predict_disease_risks(user_data)
        
        # Save predictions to Supabase
        for prediction in ai_predictions["predictions"]:
            prediction_data = {
                "disease_name": prediction["disease_name"].lower().replace(" ", "_"),
                "risk_score": str(prediction["risk_score"] / 100),  # Convert percentage to decimal
                "risk_category": prediction["risk_category"],
                "confidence_score": str(prediction["confidence_score"] / 100),  # Convert percentage to decimal
                "model_version": ai_predictions["model_version"],
                "features_used": list(user_data.keys()),
                "recommendations": prediction["recommendations"],
                "prediction_date": datetime.utcnow().isoformat(),
                "is_active": True
            }
            
            await supabase.save_risk_prediction(user_id, prediction_data)
        
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
