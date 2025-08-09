# views/content_views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from models.course_model import Content, Module

VALID_CONTENT_TYPES = ["video", "article", "quiz", "assignment"]


@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_content_view(request):
    """Create new content under a module."""
    data = json.loads(request.body.decode("utf-8"))

    module_id = data.get("module_id")
    if not module_id:
        return JsonResponse({"error": "module_id is required"}, status=400)

    if data.get("content_type") not in VALID_CONTENT_TYPES:
        return JsonResponse(
            {"error": f"Invalid content_type. Must be one of {VALID_CONTENT_TYPES}"},
            status=400
        )

    module = get_object_or_404(Module, id=module_id)

    content = Content.objects.create(
        module=module,
        content_type=data["content_type"],
        title=data.get("title", ""),
        description=data.get("description", ""),
        url=data.get("url", ""),
        duration_minutes=data.get("duration_minutes"),
        order_index=data.get("order_index", 1),
        is_free_preview=bool(data.get("is_free_preview", False)),
    )

    return JsonResponse({"status": "success", "content_id": content.id}, status=201)


@require_http_methods(["GET"])
def list_content_view(request, module_id=None):
    """List all content or content for a specific module."""
    if module_id:
        get_object_or_404(Module, id=module_id)  # Ensure module exists
        content_list = list(Content.objects.filter(module_id=module_id).values())
    else:
        content_list = list(Content.objects.values())

    return JsonResponse({"content": content_list}, status=200)


@require_http_methods(["GET"])
def get_content_view(request, content_id):
    """Retrieve a single content item."""
    content = get_object_or_404(Content, id=content_id)
    return JsonResponse({
        "id": content.id,
        "module_id": content.module.id,
        "content_type": content.content_type,
        "title": content.title,
        "description": content.description,
        "url": content.url,
        "duration_minutes": content.duration_minutes,
        "order_index": content.order_index,
        "is_free_preview": content.is_free_preview,
    }, status=200)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@transaction.atomic
def update_content_view(request, content_id):
    """Update an existing content item."""
    content = get_object_or_404(Content, id=content_id)
    data = json.loads(request.body.decode("utf-8"))

    if "content_type" in data and data["content_type"] not in VALID_CONTENT_TYPES:
        return JsonResponse(
            {"error": f"Invalid content_type. Must be one of {VALID_CONTENT_TYPES}"},
            status=400
        )

    if "module_id" in data:
        module = get_object_or_404(Module, id=data["module_id"])
        content.module = module

    for field in ["title", "description", "url", "duration_minutes", "order_index", "is_free_preview", "content_type"]:
        if field in data:
            setattr(content, field, data[field])

    content.save()
    return JsonResponse({"status": "success", "content_id": content.id}, status=200)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_content_view(request, content_id):
    """Delete a content item."""
    content = get_object_or_404(Content, id=content_id)
    content.delete()
    return JsonResponse({"status": "success", "message": "Content deleted"}, status=200)
