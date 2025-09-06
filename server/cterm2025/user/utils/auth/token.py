import jwt
import datetime
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

# Secret key & algorithm
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"

def generate_access_token(user):
    """Generate JWT access token for a user"""
    payload = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30),  # expires in 30 min
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def generate_refresh_token(user):
    """Generate refresh token (longer-lived)"""
    payload = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    """Decode JWT and handle errors"""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid token")
