"""
API v1 router for the Disease Risk Prediction API with Supabase integration
"""

from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, predictions

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
