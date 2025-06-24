"""
Authentication endpoints for the Disease Risk Prediction API with Supabase integration
"""

from datetime import timedelta
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from app.core.config import settings
from app.core.supabase import get_supabase_client, SupabaseClient
from app.core.auth_middleware import get_current_user, get_current_active_user
from app.schemas.auth import Token, UserCreate, UserResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str = None


class PasswordResetRequest(BaseModel):
    email: str


class PasswordUpdateRequest(BaseModel):
    token: str
    new_password: str


@router.post("/register")
async def register(
    user_data: RegisterRequest,
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Register a new user with Supabase Auth
    """
    if not supabase.is_connected():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable"
        )
    
    try:
        # Register user with Supabase Auth
        response = supabase.client.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "full_name": user_data.full_name
                }
            }
        })
        
        if response.user:
            # Create initial user profile
            await supabase.create_user_profile(
                response.user.id,
                {
                    "full_name": user_data.full_name,
                    "demographics_complete": False,
                    "lifestyle_complete": False,
                    "medical_history_complete": False
                }
            )
            
            return {
                "message": "User registered successfully",
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "email_confirmed": response.user.email_confirmed_at is not None
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )
            
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login")
async def login(
    login_data: LoginRequest,
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Login user with Supabase Auth
    """
    if not supabase.is_connected():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable"
        )
    
    try:
        # Authenticate with Supabase
        response = supabase.client.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        
        if response.user and response.session:
            return {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "token_type": "bearer",
                "expires_in": response.session.expires_in,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "email_confirmed": response.user.email_confirmed_at is not None
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
            
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


@router.post("/refresh")
async def refresh_token(
    refresh_token: str,
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Refresh access token using refresh token
    """
    if not supabase.is_connected():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable"
        )
    
    try:
        response = supabase.client.auth.refresh_session(refresh_token)
        
        if response.session:
            return {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "token_type": "bearer",
                "expires_in": response.session.expires_in
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
            
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )


@router.post("/logout")
async def logout(
    current_user: Dict[str, Any] = Depends(get_current_user),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, str]:
    """
    Logout user (sign out from Supabase)
    """
    if not supabase.is_connected():
        return {"message": "Logged out successfully"}
    
    try:
        supabase.client.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return {"message": "Logged out successfully"}


@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest,
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, str]:
    """
    Send password reset email via Supabase
    """
    if not supabase.is_connected():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable"
        )
    
    try:
        supabase.client.auth.reset_password_email(request.email)
        return {"message": "Password reset email sent"}
    except Exception as e:
        logger.error(f"Password reset error: {e}")
        # Don't reveal if email exists or not for security
        return {"message": "Password reset email sent"}


@router.post("/reset-password")
async def reset_password(
    request: PasswordUpdateRequest,
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, str]:
    """
    Reset password with token from email
    """
    if not supabase.is_connected():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable"
        )
    
    try:
        # Verify and update password
        response = supabase.client.auth.update_user({
            "password": request.new_password
        })
        
        if response.user:
            return {"message": "Password updated successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password reset failed"
            )
            
    except Exception as e:
        logger.error(f"Password update error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset failed"
        )


@router.get("/me")
async def get_current_user_info(
    current_user: Dict[str, Any] = Depends(get_current_user),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Get current user information and profile
    """
    user_profile = await supabase.get_user_profile(current_user["id"])
    
    return {
        "user": current_user,
        "profile": user_profile
    }
