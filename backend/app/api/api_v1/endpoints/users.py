"""
User profile and health data endpoints with Supabase integration
"""

from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime

from app.core.supabase import get_supabase_client, SupabaseClient
from app.core.auth_middleware import get_current_user, get_user_id
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class UserProfileUpdate(BaseModel):
    full_name: str = None
    age: int = None
    sex: str = None
    height_cm: float = None
    weight_kg: float = None
    ethnicity: str = None


class LifestyleData(BaseModel):
    diet_type: str = None
    exercise_frequency: str = None
    sleep_hours: float = None
    tobacco_use: str = None
    alcohol_consumption: str = None
    occupation: str = None
    environmental_exposures: str = None


class MedicalHistoryData(BaseModel):
    past_diagnoses: List[str] = []
    family_history: List[str] = []
    current_symptoms: List[str] = []
    medications: List[str] = []


class LabResultData(BaseModel):
    test_name: str
    test_value: str
    test_unit: str = None
    reference_range: str = None
    test_date: datetime
    lab_name: str = None
    doctor_name: str = None
    notes: str = None


@router.get("/profile")
async def get_user_profile(
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Get user profile information
    """
    profile = await supabase.get_user_profile(user_id)
    
    if not profile:
        # Create empty profile if doesn't exist
        await supabase.create_user_profile(user_id, {
            "demographics_complete": False,
            "lifestyle_complete": False,
            "medical_history_complete": False
        })
        profile = await supabase.get_user_profile(user_id)
    
    return {"profile": profile}


@router.put("/profile/demographics")
async def update_demographics(
    profile_data: UserProfileUpdate,
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Update user demographic information
    """
    # Prepare update data (only include non-None values)
    update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    update_data["demographics_complete"] = True
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    success = await supabase.update_user_profile(user_id, update_data)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update profile"
        )
    
    return {"message": "Demographics updated successfully"}


@router.put("/profile/lifestyle")
async def update_lifestyle(
    lifestyle_data: LifestyleData,
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Update user lifestyle information
    """
    # Prepare update data (only include non-None values)
    update_data = {k: v for k, v in lifestyle_data.dict().items() if v is not None}
    update_data["lifestyle_complete"] = True
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    success = await supabase.update_user_profile(user_id, update_data)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update lifestyle data"
        )
    
    return {"message": "Lifestyle data updated successfully"}


@router.put("/profile/medical-history")
async def update_medical_history(
    medical_data: MedicalHistoryData,
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Update user medical history information
    """
    # Convert lists to JSON strings for storage
    update_data = {
        "past_diagnoses": medical_data.past_diagnoses,
        "family_history": medical_data.family_history,
        "current_symptoms": medical_data.current_symptoms,
        "medications": medical_data.medications,
        "medical_history_complete": True,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    success = await supabase.update_user_profile(user_id, update_data)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update medical history"
        )
    
    return {"message": "Medical history updated successfully"}


@router.post("/lab-results")
async def add_lab_result(
    lab_data: LabResultData,
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Add a new lab result
    """
    lab_result_data = {
        "test_name": lab_data.test_name,
        "test_value": lab_data.test_value,
        "test_unit": lab_data.test_unit,
        "reference_range": lab_data.reference_range,
        "test_date": lab_data.test_date.isoformat(),
        "lab_name": lab_data.lab_name,
        "doctor_name": lab_data.doctor_name,
        "notes": lab_data.notes,
        "created_at": datetime.utcnow().isoformat()
    }
    
    success = await supabase.save_lab_result(user_id, lab_result_data)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to save lab result"
        )
    
    return {"message": "Lab result added successfully"}


@router.get("/lab-results")
async def get_lab_results(
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get all lab results for the user
    """
    lab_results = await supabase.get_lab_results(user_id)
    return {"lab_results": lab_results}


@router.get("/risk-predictions")
async def get_risk_predictions(
    user_id: str = Depends(get_user_id),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get all risk predictions for the user
    """
    predictions = await supabase.get_risk_predictions(user_id)
    return {"predictions": predictions}


@router.delete("/profile")
async def delete_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, str]:
    """
    Delete user profile and all associated data
    """
    user_id = current_user["id"]
    
    try:
        # Delete from all tables
        if supabase.client:
            # Delete lab results
            supabase.client.table('lab_results').delete().eq('user_id', user_id).execute()
            
            # Delete risk predictions
            supabase.client.table('risk_predictions').delete().eq('user_id', user_id).execute()
            
            # Delete user profile
            supabase.client.table('user_profiles').delete().eq('user_id', user_id).execute()
        
        return {"message": "Profile deleted successfully"}
        
    except Exception as e:
        logger.error(f"Profile deletion error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete profile"
        )
