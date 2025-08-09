import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from django.db import transaction
from models.course_model import Course


@csrf_exempt
@transaction.atomic
def create_course_view(request):
    """Create a new course"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        course = Course.objects.create(
            name=data.get("name"),
            code=data.get("code"),
            description=data.get("description"),
            syllabus_url=data.get("syllabus_url"),
            prerequisites=data.get("prerequisites"),
            estimated_duration=data.get("estimated_duration"),
            start_date=parse_date(data.get("start_date")),
            end_date=parse_date(data.get("end_date")),
            is_published=data.get("is_published", False),
        )
        return JsonResponse({"status": "success", "course_id": course.id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def list_courses_view(request):
    """List all courses"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method allowed"}, status=405)

    courses = list(Course.objects.values())
    return JsonResponse({"courses": courses}, status=200)


def get_course_view(request, course_id):
    """Retrieve a single course by ID"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method allowed"}, status=405)

    course = get_object_or_404(Course, id=course_id)
    return JsonResponse({
        "id": course.id,
        "name": course.name,
        "code": course.code,
        "description": course.description,
        "syllabus_url": course.syllabus_url,
        "prerequisites": course.prerequisites,
        "estimated_duration": course.estimated_duration,
        "start_date": course.start_date,
        "end_date": course.end_date,
        "is_published": course.is_published,
    }, status=200)


@csrf_exempt
@transaction.atomic
def update_course_view(request, course_id):
    """Update an existing course"""
    if request.method not in ["PUT", "PATCH"]:
        return JsonResponse({"error": "Only PUT/PATCH method allowed"}, status=405)

    course = get_object_or_404(Course, id=course_id)

    try:
        data = json.loads(request.body.decode("utf-8"))
        for field in ["name", "code", "description", "syllabus_url", "prerequisites",
                      "estimated_duration", "is_published"]:
            if field in data:
                setattr(course, field, data[field])

        if "start_date" in data:
            course.start_date = parse_date(data["start_date"])
        if "end_date" in data:
            course.end_date = parse_date(data["end_date"])

        course.save()
        return JsonResponse({"status": "success", "course_id": course.id}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@transaction.atomic
def delete_course_view(request, course_id):
    """Delete a course"""
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE method allowed"}, status=405)

    course = get_object_or_404(Course, id=course_id)
    course.delete()
    return JsonResponse({"status": "success"}, status=204)
