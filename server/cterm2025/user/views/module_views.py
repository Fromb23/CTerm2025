# views/module_views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from models.course_model import Course, Module


@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_module_view(request):
    """Create a new module under a course."""
    data = json.loads(request.body.decode("utf-8"))
    course_id = data.get("course_id")

    if not course_id:
        return JsonResponse({"error": "course_id is required"}, status=400)

    course = get_object_or_404(Course, id=course_id)

    module = Module.objects.create(
        course=course,
        title=data.get("title", ""),
        description=data.get("description", ""),
        order_index=data.get("order_index", 1),
        estimated_hours=data.get("estimated_hours"),
        is_active=bool(data.get("is_active", True)),
    )

    return JsonResponse({"status": "success", "module_id": module.id}, status=201)


@require_http_methods(["GET"])
def list_modules_view(request, course_id=None):
    """List all modules or modules for a specific course."""
    if course_id:
        get_object_or_404(Course, id=course_id)  # Ensure course exists
        modules = list(Module.objects.filter(course_id=course_id).values())
    else:
        modules = list(Module.objects.values())

    return JsonResponse({"modules": modules}, status=200)


@require_http_methods(["GET"])
def get_module_view(request, module_id):
    """Retrieve a single module."""
    module = get_object_or_404(Module, id=module_id)
    return JsonResponse({
        "id": module.id,
        "course_id": module.course.id,
        "title": module.title,
        "description": module.description,
        "order_index": module.order_index,
        "estimated_hours": module.estimated_hours,
        "is_active": module.is_active,
    }, status=200)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@transaction.atomic
def update_module_view(request, module_id):
    """Update an existing module."""
    module = get_object_or_404(Module, id=module_id)
    data = json.loads(request.body.decode("utf-8"))

    if "course_id" in data:
        course = get_object_or_404(Course, id=data["course_id"])
        module.course = course

    for field in ["title", "description", "order_index", "estimated_hours", "is_active"]:
        if field in data:
            setattr(module, field, data[field])

    module.save()
    return JsonResponse({"status": "success", "module_id": module.id}, status=200)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_module_view(request, module_id):
    """Delete a module."""
    module = get_object_or_404(Module, id=module_id)
    module.delete()
    return JsonResponse({"status": "success", "message": "Module deleted"}, status=200)
