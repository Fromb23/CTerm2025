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
def create_module_view(request):
    """Create a new module under a course."""
    data = json.loads(request.body.decode("utf-8"))
    sprint_id = data.get("sprint_id")

    if not sprint_id:
        return JsonResponse({"error": "sprint_id is required"}, status=400)

    sprint = get_object_or_404(Sprint, id=sprint_id)

    module = Module.objects.create(
        name=data.get("title", ""),
        description=data.get("description", ""),
        order_index=data.get("order_index", 0),
        start_date=data.get("start_date"),
        end_date=data.get("end_date"),
        status=data.get("status", "draft"),
        sprint=get_object_or_404(Sprint, id=data.get("sprint_id")) if data.get("sprint_id") else None,
        is_active=data.get("is_active", True),
    )

    return JsonResponse({"status": "success", "module_id": module.id}, status=201)


@require_http_methods(["GET"])
def list_modules_view(request, sprint_id=None):
    """List all modules or modules for a specific sprint."""
    if sprint_id:
        get_object_or_404(Sprint, id=sprint_id)  # Ensure sprint exists
        modules = list(Module.objects.filter(sprint_id=sprint_id).values())
    else:
        modules = list(Module.objects.values())

    return JsonResponse({"modules": modules}, status=200)


@require_http_methods(["GET"])
def get_module_view(request, module_id):
    """Retrieve a single module."""
    module = get_object_or_404(Module, id=module_id)
    return JsonResponse({
        "id": module.id,
        "name": module.name,
        "start_date": module.start_date.isoformat() if module.start_date else None,
        "end_date": module.end_date.isoformat() if module.end_date else None,
        "description": module.description,
        "status": module.status,
        "sprint_id": module.sprint.id,
        "is_active": module.is_active,
        "created_at": module.created_at.isoformat(),
        "updated_at": module.updated_at.isoformat(),
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

    for field in ["name", "start_date", "end_date", "description", "status", "is_active"]:
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
