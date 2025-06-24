"""
Authentication middleware for Supabase integration
"""

from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.supabase import get_supabase_client, SupabaseClient
import logging

logger = logging.getLogger(__name__)

# Security scheme for Bearer token
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Dict[str, Any]:
    """
    Dependency to get current authenticated user from Supabase token
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    user_data = await supabase.verify_user_token(token)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_data


async def get_current_active_user(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Dependency to get current active user (additional validation if needed)
    """
    # Add any additional user validation logic here
    # For example, check if user is active, verified, etc.
    
    return current_user


def get_user_id(current_user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """
    Dependency to extract user ID from current user
    """
    return current_user["id"]


async def optional_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    supabase: SupabaseClient = Depends(get_supabase_client)
) -> Optional[Dict[str, Any]]:
    """
    Optional authentication dependency - returns user if authenticated, None otherwise
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        user_data = await supabase.verify_user_token(token)
        return user_data
    except Exception as e:
        logger.warning(f"Optional auth failed: {e}")
        return None


class AuthenticationError(Exception):
    """Custom authentication error"""
    pass


class AuthorizationError(Exception):
    """Custom authorization error"""
    pass
