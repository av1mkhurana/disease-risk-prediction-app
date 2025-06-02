"""
Security utilities for the Disease Risk Prediction API
"""

from datetime import datetime, timedelta
from typing import Any, Union, Optional

from jose import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet

from app.core.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Encryption for sensitive data
def get_encryption_key() -> bytes:
    """Get or generate encryption key for sensitive data"""
    if settings.ENCRYPTION_KEY:
        return settings.ENCRYPTION_KEY.encode()
    else:
        # Generate a new key (in production, this should be stored securely)
        return Fernet.generate_key()

fernet = Fernet(get_encryption_key())


def create_access_token(
    data: dict, expires_delta: Union[timedelta, None] = None
) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.JWTError:
        return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def encrypt_sensitive_data(data: str) -> str:
    """Encrypt sensitive data for database storage"""
    if not data:
        return data
    return fernet.encrypt(data.encode()).decode()


def decrypt_sensitive_data(encrypted_data: str) -> str:
    """Decrypt sensitive data from database"""
    if not encrypted_data:
        return encrypted_data
    try:
        return fernet.decrypt(encrypted_data.encode()).decode()
    except Exception:
        # If decryption fails, return empty string
        return ""


def encrypt_json_data(data: dict) -> str:
    """Encrypt JSON data for database storage"""
    import json
    if not data:
        return ""
    json_str = json.dumps(data)
    return encrypt_sensitive_data(json_str)


def decrypt_json_data(encrypted_data: str) -> dict:
    """Decrypt JSON data from database"""
    import json
    if not encrypted_data:
        return {}
    try:
        json_str = decrypt_sensitive_data(encrypted_data)
        return json.loads(json_str) if json_str else {}
    except Exception:
        return {}


def generate_reset_token(email: str) -> str:
    """Generate password reset token"""
    data = {"sub": email, "type": "reset"}
    expires_delta = timedelta(hours=1)  # Reset token expires in 1 hour
    return create_access_token(data, expires_delta)


def verify_reset_token(token: str) -> Optional[str]:
    """Verify password reset token and return email"""
    payload = verify_token(token)
    if payload and payload.get("type") == "reset":
        return payload.get("sub")
    return None
