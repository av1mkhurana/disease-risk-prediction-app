"""
User model for the Disease Risk Prediction API
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    """User model for authentication and profile management"""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Privacy settings
    data_sharing_consent = Column(Boolean, default=False)
    marketing_consent = Column(Boolean, default=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class UserProfile(Base):
    """Extended user profile with health-related information"""
    
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True)  # Foreign key to users
    
    # Demographics (encrypted)
    age = Column(String, nullable=True)  # Encrypted
    sex = Column(String, nullable=True)  # Encrypted
    height_cm = Column(String, nullable=True)  # Encrypted
    weight_kg = Column(String, nullable=True)  # Encrypted
    ethnicity = Column(String, nullable=True)  # Encrypted
    
    # Lifestyle factors (encrypted)
    diet_type = Column(String, nullable=True)  # Encrypted
    exercise_frequency = Column(String, nullable=True)  # Encrypted
    sleep_hours = Column(String, nullable=True)  # Encrypted
    tobacco_use = Column(String, nullable=True)  # Encrypted
    alcohol_consumption = Column(String, nullable=True)  # Encrypted
    occupation = Column(String, nullable=True)  # Encrypted
    environmental_exposures = Column(Text, nullable=True)  # Encrypted
    
    # Medical history (encrypted)
    past_diagnoses = Column(Text, nullable=True)  # Encrypted JSON
    family_history = Column(Text, nullable=True)  # Encrypted JSON
    current_symptoms = Column(Text, nullable=True)  # Encrypted JSON
    medications = Column(Text, nullable=True)  # Encrypted JSON
    
    # Profile completion status
    demographics_complete = Column(Boolean, default=False)
    lifestyle_complete = Column(Boolean, default=False)
    medical_history_complete = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<UserProfile(id={self.id}, user_id={self.user_id})>"


class LabResult(Base):
    """Lab test results for users"""
    
    __tablename__ = "lab_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # Foreign key to users
    
    # Lab test information
    test_name = Column(String, nullable=False)
    test_value = Column(String, nullable=False)  # Encrypted
    test_unit = Column(String, nullable=True)
    reference_range = Column(String, nullable=True)
    test_date = Column(DateTime, nullable=False)
    
    # Metadata
    lab_name = Column(String, nullable=True)
    doctor_name = Column(String, nullable=True)
    notes = Column(Text, nullable=True)  # Encrypted
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<LabResult(id={self.id}, user_id={self.user_id}, test_name={self.test_name})>"


class RiskPrediction(Base):
    """Disease risk predictions for users"""
    
    __tablename__ = "risk_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # Foreign key to users
    
    # Prediction details
    disease_name = Column(String, nullable=False)
    risk_score = Column(String, nullable=False)  # Encrypted percentage
    risk_category = Column(String, nullable=False)  # Low, Medium, High
    confidence_score = Column(String, nullable=True)  # Encrypted
    
    # Model information
    model_version = Column(String, nullable=False)
    features_used = Column(Text, nullable=True)  # JSON of features
    
    # Recommendations
    recommendations = Column(Text, nullable=True)  # Encrypted JSON
    
    # Metadata
    prediction_date = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<RiskPrediction(id={self.id}, user_id={self.user_id}, disease={self.disease_name})>"
