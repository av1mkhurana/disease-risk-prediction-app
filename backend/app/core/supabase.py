"""
Supabase client configuration and utilities
"""

from typing import Optional, Dict, Any
from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class SupabaseClient:
    """Supabase client wrapper for database operations"""
    
    def __init__(self):
        self._client: Optional[Client] = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Supabase client"""
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            logger.warning("Supabase credentials not configured")
            return
        
        try:
            self._client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
            logger.info("Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
    
    @property
    def client(self) -> Optional[Client]:
        """Get Supabase client instance"""
        return self._client
    
    def is_connected(self) -> bool:
        """Check if Supabase client is connected"""
        return self._client is not None
    
    async def verify_user_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify Supabase user token and return user data"""
        if not self._client:
            return None
        
        try:
            response = self._client.auth.get_user(token)
            if response.user:
                return {
                    "id": response.user.id,
                    "email": response.user.email,
                    "user_metadata": response.user.user_metadata,
                    "app_metadata": response.user.app_metadata,
                    "created_at": response.user.created_at,
                    "updated_at": response.user.updated_at
                }
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
        
        return None
    
    async def create_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> bool:
        """Create user profile in Supabase"""
        if not self._client:
            return False
        
        try:
            result = self._client.table('user_profiles').insert({
                'user_id': user_id,
                **profile_data
            }).execute()
            return len(result.data) > 0
        except Exception as e:
            logger.error(f"Failed to create user profile: {e}")
            return False
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile from Supabase"""
        if not self._client:
            return None
        
        try:
            result = self._client.table('user_profiles').select('*').eq('user_id', user_id).execute()
            if result.data:
                return result.data[0]
        except Exception as e:
            logger.error(f"Failed to get user profile: {e}")
        
        return None
    
    async def update_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> bool:
        """Update user profile in Supabase"""
        if not self._client:
            return False
        
        try:
            result = self._client.table('user_profiles').update(profile_data).eq('user_id', user_id).execute()
            return len(result.data) > 0
        except Exception as e:
            logger.error(f"Failed to update user profile: {e}")
            return False
    
    async def save_lab_result(self, user_id: str, lab_data: Dict[str, Any]) -> bool:
        """Save lab result to Supabase"""
        if not self._client:
            return False
        
        try:
            result = self._client.table('lab_results').insert({
                'user_id': user_id,
                **lab_data
            }).execute()
            return len(result.data) > 0
        except Exception as e:
            logger.error(f"Failed to save lab result: {e}")
            return False
    
    async def get_lab_results(self, user_id: str) -> list:
        """Get lab results for user from Supabase"""
        if not self._client:
            return []
        
        try:
            result = self._client.table('lab_results').select('*').eq('user_id', user_id).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Failed to get lab results: {e}")
            return []
    
    async def save_risk_prediction(self, user_id: str, prediction_data: Dict[str, Any]) -> bool:
        """Save risk prediction to Supabase"""
        if not self._client:
            return False
        
        try:
            result = self._client.table('risk_predictions').insert({
                'user_id': user_id,
                **prediction_data
            }).execute()
            return len(result.data) > 0
        except Exception as e:
            logger.error(f"Failed to save risk prediction: {e}")
            return False
    
    async def get_risk_predictions(self, user_id: str) -> list:
        """Get risk predictions for user from Supabase"""
        if not self._client:
            return []
        
        try:
            result = self._client.table('risk_predictions').select('*').eq('user_id', user_id).order('prediction_date', desc=True).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"Failed to get risk predictions: {e}")
            return []


# Global Supabase client instance
supabase_client = SupabaseClient()


def get_supabase_client() -> SupabaseClient:
    """Dependency to get Supabase client"""
    return supabase_client
