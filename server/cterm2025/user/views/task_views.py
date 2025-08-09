# views/task_views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from models.course_model import Task, Content

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_task_view(request):
    """Create a new task under a content item."""
    data = json.loads(request.body.decode("utf-8"))

    content_id = data.get("content_id")
    if not content_id:
        return JsonResponse({"error": "content_id is required"}, status=400)

    content = get_object_or_404(Content, id=content_id)

    task = Task.objects.create(
        content=content,
        title=data.get("title", ""),
        description=data.get("description", ""),
        due_date=data.get("due_date"),
        max_score=data.get("max_score"),
        is_mandatory=bool(data.get("is_mandatory", False)),
    )

    return JsonResponse({"status": "success", "task_id": task.id}, status=201)


@require_http_methods(["GET"])
def list_tasks_view(request, content_id=None):
    """List all tasks, or tasks for a specific content item."""
    if content_id:
        get_object_or_404(Content, id=content_id)
        tasks = list(Task.objects.filter(content_id=content_id).values())
    else:
        tasks = list(Task.objects.values())

    return JsonResponse({"tasks": tasks}, status=200)


@require_http_methods(["GET"])
def get_task_view(request, task_id):
    """Retrieve a single task."""
    task = get_object_or_404(Task, id=task_id)
    return JsonResponse({
        "id": task.id,
        "content_id": task.content.id,
        "title": task.title,
        "description": task.description,
        "due_date": task.due_date,
        "max_score": task.max_score,
        "is_mandatory": task.is_mandatory,
    }, status=200)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@transaction.atomic
def update_task_view(request, task_id):
    """Update an existing task."""
    task = get_object_or_404(Task, id=task_id)
    data = json.loads(request.body.decode("utf-8"))

    if "content_id" in data:
        content = get_object_or_404(Content, id=data["content_id"])
        task.content = content

    for field in ["title", "description", "due_date", "max_score", "is_mandatory"]:
        if field in data:
            setattr(task, field, data[field])

    task.save()
    return JsonResponse({"status": "success", "task_id": task.id}, status=200)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_task_view(request, task_id):
    """Delete a task."""
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return JsonResponse({"status": "success", "message": "Task deleted"}, status=200)
