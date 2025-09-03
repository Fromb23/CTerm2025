# views/module_views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from user.models.course_model import Course, Sprint, Module
from user.utils.code_generator import generate_module_code



@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_module_view(request, course_id):
    """Create a new module under a course."""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    data = json.loads(request.body.decode("utf-8"))
    sprint_id = data.get("sprint_id")

    if not sprint_id or not course_id:
        return JsonResponse({"error": "sprint_id and course_id are required"}, status=400)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse({"error": "Course not found"}, status=404)

    try:
        sprint = Sprint.objects.get(id=sprint_id, course=course)
    except Sprint.DoesNotExist:
        return JsonResponse({"error": "Sprint not found for this course"}, status=404)

    module_name = data.get("name")
    existing_module = Module.objects.filter(sprint=sprint, name=module_name).first()
    if existing_module:
        return JsonResponse({"error": "Module name already exists for this sprint"}, status=400)

    module = Module.objects.create(
        name=module_name,
        description=data.get("description", ""),
        order_index=data.get("order_index", 0),
        start_date=data.get("start_date"),
        end_date=data.get("end_date"),
        status=data.get("status", "draft"),
        sprint=sprint,
        is_active=data.get("is_active", True),
    )

    return JsonResponse(
        {"status": "success", "module_id": module.id},
        status=201
    )


@require_http_methods(["GET"])
def list_modules_view(request, course_id):
    """List all modules for a specific course."""
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse({"error": "Course not found"}, status=404)

    modules = list(Module.objects.filter(sprint__course_id=course_id).values())
    return JsonResponse({"modules": modules}, status=200)


@require_http_methods(["GET"])
def list_module_view(request, course_id, module_id):
    """Retrieve a single module based on a course"""

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse({"error": "Course not found"}, status=404)

    try:
        module = Module.objects.get(id=module_id, sprint__course=course)
    except Module.DoesNotExist:
        return JsonResponse({"error": "Module not found for this course"}, status=404)

    return JsonResponse({
    "id": module.id,
    "name": module.name,
    "start_date": module.start_date.isoformat() if module.start_date else None,
    "end_date": module.end_date.isoformat() if module.end_date else None,
    "description": module.description,
    "status": module.status,
    "sprint": {
        "id": module.sprint.id,
        "name": module.sprint.name,
        "start_date": module.sprint.start_date.isoformat() if module.sprint.start_date else None,
    },
    "is_active": module.is_active,
    "created_at": module.created_at.isoformat(),
    "updated_at": module.updated_at.isoformat(),
}, status=200)


@csrf_exempt
@require_http_methods("PATCH")
@transaction.atomic
def update_module_view(request, module_id, course_id):
    """Update a module of a course"""

    if not module_id or not course_id:
        return JsonResponse({"error": "module_id and course_id are required"}, status=400)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse({"error": "Course not found"}, status=404)

    try:
        module = Module.objects.get(id=module_id, sprint__course=course)
    except Module.DoesNotExist:
        return JsonResponse({"error": "Module not found for this course"}, status=404)

    data = json.loads(request.body.decode("utf-8"))

    valid_fields = ["name", "start_date", "end_date", "duration", "description", "status", "is_active"]
    invalid_fields = [field for field in data if field not in valid_fields]

    if invalid_fields:
        return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

    for field in valid_fields:
        if field in data:
            setattr(module, field, data[field])

    module.save()
    return JsonResponse({"status": "success", "module_id": module.id}, status=200)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_module_view(request, module_id, course_id):
    """Delete a module."""
    if not module_id or not course_id:
        return JsonResponse({"error": "module_id and course_id are required"}, status=400)
    
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse({"error": "Course not found"}, status=404)

    try:
        module = Module.objects.get(id=module_id, sprint__course=course)
    except Module.DoesNotExist:
        return JsonResponse({"error": "Module not found for this course"}, status=404)

    module.delete()
    return JsonResponse({"status": "success", "message": "Module deleted"}, status=200)
