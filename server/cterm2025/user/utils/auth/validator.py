import re
from django.core.exceptions import ValidationError

def validate_email(value: str):
    """Validate email format"""
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_regex, value):
        raise ValidationError("Invalid email format")
    return value

def validate_password(value: str):
    """Validate strong password"""
    if len(value) < 8:
        raise ValidationError("Password must be at least 8 characters")
    if not re.search(r"[A-Z]", value):
        raise ValidationError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", value):
        raise ValidationError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", value):
        raise ValidationError("Password must contain at least one digit")
    if not re.search(r"[@$!%*#?&]", value):
        raise ValidationError("Password must contain at least one special character (@$!%*#?&)")
    return value

def validate_phone(value: str):
    """Validate Kenyan phone number format"""
    phone_regex = r"^\+254\d{9}$"   # e.g. +254712345678
    if not re.match(phone_regex, value):
        raise ValidationError("Invalid phone number format. Use +254XXXXXXXXX")
    return value
