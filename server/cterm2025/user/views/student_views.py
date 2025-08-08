# student_views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from user.models.user_models import CustomUser, StudentProfile


@csrf_exempt
@transaction.atomic
def create_student_view(request):
    """Create a new student user + profile"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests allowed"}, status=405)

    email = request.POST.get("email")
    full_name = request.POST.get("full_name")
    password = request.POST.get("password")

    if not email or not full_name or not password:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    if CustomUser.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already in use"}, status=400)

    try:
        user = CustomUser.objects.create(
            email=email,
            full_name=full_name,
            password=make_password(password),
            role="student"
        )
        StudentProfile.objects.create(user=user)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"status": "success", "user_id": str(user.id)}, status=201)


def read_students_view(request):
    """List all students with basic info"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests allowed"}, status=405)

    students = CustomUser.objects.filter(role="student").select_related("studentprofile")
    data = [
        {
            "id": str(student.id),
            "email": student.email,
            "full_name": student.full_name,
            "date_joined": student.date_joined,
        }
        for student in students
    ]

    return JsonResponse({"students": data}, status=200)


@csrf_exempt
@transaction.atomic
def update_student_view(request, student_id):
    """Update a student's details"""
    if request.method != "PUT":
        return JsonResponse({"error": "Only PUT requests allowed"}, status=405)

    user = get_object_or_404(CustomUser, id=student_id, role="student")

    email = request.POST.get("email")
    full_name = request.POST.get("full_name")
    password = request.POST.get("password")

    if email:
        if CustomUser.objects.filter(email=email).exclude(id=student_id).exists():
            return JsonResponse({"error": "Email already in use"}, status=400)
        user.email = email

    if full_name:
        user.full_name = full_name

    if password:
        user.password = make_password(password)

    user.save()

    return JsonResponse({"status": "success", "updated_id": str(user.id)}, status=200)


@csrf_exempt
@transaction.atomic
def delete_student_view(request, student_id):
    """Delete a student user and profile"""
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE requests allowed"}, status=405)

    user = get_object_or_404(CustomUser, id=student_id, role="student")
    user.delete()

    return JsonResponse({"status": "success", "deleted_id": str(student_id)}, status=200)
