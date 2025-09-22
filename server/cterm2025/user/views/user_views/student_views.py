# student_views.py
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.contrib.auth.hashers import make_password
from user.models.user_models import CustomUser, StudentProfile, UserType


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic()
def create_student_view(request):
    """Create a new student user + profile"""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    valid_fields = {"email", "full_name", "password", "current_level", "education_background", "career_goals", "skills", "preferred_language"}
    invalid_fields = [field for field in data if field not in valid_fields]
    if invalid_fields:
        return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

    email = data.get("email")
    if CustomUser.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already in use"}, status=400)

    try:
        user = CustomUser.objects.create_user(
            email=email,
            full_name=data.get("full_name", ""),
            password=data.get("password", ""),
            user_type=UserType.STUDENT
        )
        StudentProfile.objects.create(
            user=user,
            current_level=data.get("current_level", ""),
            education_background=data.get("education_background", ""),
            career_goals=data.get("career_goals", ""),
            skills=data.get("skills", ""),
            preferred_language=data.get("preferred_language", "")
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"status": "success", "data": {
        "student_id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "date_joined": user.created_at,
        "current_level": user.student_profile.current_level,
        "education_background": user.student_profile.education_background,
        "career_goals": user.student_profile.career_goals,
        "skills": user.student_profile.skills,
        "preferred_language": user.student_profile.preferred_language,
    }}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@transaction.atomic()
def list_students_view(request):
    """List all students with basic info"""

    students = CustomUser.objects.filter(user_type="student").select_related("student_profile")
    data = [
        {
            "id": str(student.id),
            "email": student.email,
            "full_name": student.full_name,
            "created_at": student.created_at,
        }
        for student in students
    ]

    return JsonResponse({"students": data}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def get_student_details_view(request, student_id):
    """Get details of a specific student"""
    if not student_id:
        return JsonResponse({"error": "Student ID is required"}, status=400)

    user = CustomUser.objects.filter(id=student_id, user_type="student").first()
    if not user:
        return JsonResponse({"error": "Student not found"}, status=404)

    data = {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "created_at": user.created_at,
        "current_level": user.student_profile.current_level,
        "education_background": user.student_profile.education_background,
        "career_goals": user.student_profile.career_goals,
        "skills": user.student_profile.skills,
        "preferred_language": user.student_profile.preferred_language,
    }

    return JsonResponse({"student": data}, status=200)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_student_view(request, student_id):
    """Update a student's details"""
    if not student_id:
        return JsonResponse({"error": "Student ID is required"}, status=400)
    
    data = json.loads(request.body)

    user = CustomUser.objects.filter(id=student_id, role="student").first()
    if not user:
        return JsonResponse({"error": "Student not found"}, status=404)
    
    valid_fields = {"email", "full_name", "password", "current_level", "education_background", "career_goals", "skills", "preferred_language"}
    invalid_fields = [field for field in data if field not in valid_fields]
    if invalid_fields:
        return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)
    
    for field in valid_fields:
        if field in data:
            if field == "password":
                setattr(user, field, make_password(data[field]))
            else:
                setattr(user, field, data[field])
    user.save()

    return JsonResponse({"status": "success", "updated_id": str(user.id)}, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_student_view(request, student_id):
    """Delete a student user and profile"""
    if not student_id:
        return JsonResponse({"error": "Student ID is required"}, status=400)

    try:
        user = CustomUser.objects.get(id=student_id, role="student")
        user.delete()
        return JsonResponse({"status": "success", "message": "Student deleted successfully"}, status=200)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "Student not found"}, status=404)
