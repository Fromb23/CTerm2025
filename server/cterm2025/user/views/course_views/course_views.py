import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date
from django.db import transaction
from user.models.course_model import Course
from user.utils.code_generator import generate_course_code


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_course_view(request):
    """Create a new course"""

    try:
        data = json.loads(request.body.decode("utf-8"))
        existing_course_name = Course.objects.filter(name=data.get("name")).exists()
        if existing_course_name:
            return JsonResponse({"error": "Course with this name already exists"}, status=400)

        course = Course.objects.create(
            name=data.get("name"),
            course_code=generate_course_code(data.get("name")),
            mode_of_learning=data.get("mode_of_learning", "online"),
            description=data.get("description"),
            commitment_time=data.get("commitment_time", 0),
            frequently_asked_questions=data.get("frequently_asked_questions", ""),
            start_date=parse_date(data.get("start_date")),
            duration=data.get("estimated_duration", 0),
            requirements=data.get("requirements", ""),
            is_published=data.get("is_published", False),
        )
        return JsonResponse({"status": "success", "course": {
            "id": course.id,
            "name": course.name,
            "course_code": course.course_code,
            "description": course.description,
            "mode_of_learning": course.mode_of_learning,
            "commitment_time": course.commitment_time,
            "estimated_duration": course.duration,
            "requirements": course.requirements,
            "frequently_asked_questions": course.frequently_asked_questions,
            "start_date": course.start_date,
            "is_published": course.is_published,
        }}, status=201)
    except Exception as e:
        print(f"Error creating course: {e}")
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_courses_view(request):
    """List all courses"""

    courses = list(Course.objects.values())
    print("Courses:", courses)
    return JsonResponse({"courses": courses}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_course_view(request, course_id):
    """Retrieve a single course by ID"""

    course = get_object_or_404(Course, id=course_id)
    return JsonResponse({
        "id": course.id,
        "name": course.name,
        "course_code": course.course_code,
        "description": course.description,
        "mode_of_learning": course.mode_of_learning,
        "commitment_time": course.commitment_time,
        "estimated_duration": course.duration,
        "requirements": course.requirements,
        "frequently_asked_questions": course.frequently_asked_questions,
        "start_date": course.start_date,
        "is_published": course.is_published,
    }, status=200)


@transaction.atomic
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_course_view(request, course_id):
    """Update an existing course"""

    course = get_object_or_404(Course, id=course_id)

    try:
        data = json.loads(request.body.decode("utf-8"))
        valid_fields = ["name", "code", "description", "mode_of_learning",
                        "commitment_time", "duration", "requirements",
                        "frequently_asked_questions", "is_published"]
        invalid_fields = [field for field in data if field not in valid_fields]
        if invalid_fields:
            return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)
        if "name" in data and data["name"] != course.name:
            if Course.objects.filter(name=data["name"]).exclude(id=course_id).exists():
                return JsonResponse({"error": "Course with this name already exists"}, status=400)
        for field in valid_fields:
            if field in data:
                setattr(course, field, data[field])

        if "start_date" in data:
            course.start_date = parse_date(data["start_date"])
        
        course.save()
        return JsonResponse({"status": "success", "course_id": course.id}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
@transaction.atomic
def delete_course_view(request, course_id):
    """Delete a course"""
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE method allowed"}, status=405)

    try:
        course = Course.objects.get(id=course_id)
        course.delete()
    except Course.DoesNotExist:
        return JsonResponse({"status": "Course not found"}, status=404)
    return JsonResponse({"status": "success"}, status=204)
