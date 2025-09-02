# views/task_views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from user.models.course_model import Task, Topic, Project
from .quiz_views import create_quiz_view as create_quiz_for_task
from user.utils.serialize_task import serialize_task

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_task_view(request, task_data=None):
    """
    Create a new task.
    If task_data is provided, use it (for internal calls),
    otherwise use request.body (for API calls).
    """
    if task_data is None:
        task_data = json.loads(request.body.decode("utf-8"))

    topic_id = task_data.get("topic_id")
    project_id = task_data.get("project_id")

    topic = get_object_or_404(Topic, id=topic_id) if topic_id else None
    project = get_object_or_404(Project, id=project_id) if project_id else None

    task = Task.objects.create(
        topic=topic,
        project=project,
        name=task_data.get("name", ""),
        task_type=task_data.get("task_type", ""),
        description=task_data.get("description", ""),
        is_mandatory=bool(task_data.get("is_mandatory", False)),
        submission_format=task_data.get("submission_format", ""),
        max_score=task_data.get("max_score"),
        first_deadline=task_data.get("first_deadline"),
        second_deadline=task_data.get("second_deadline"),
        third_deadline=task_data.get("third_deadline"),
        unlocks_next_topic=bool(task_data.get("unlocks_next_topic", True)),
        due_date=task_data.get("due_date"),
    )

    # Handle special task types
    if task.task_type == "quiz":
        quiz_data = task_data.get("quiz_data", {})
        create_quiz_for_task(task, quiz_data)
    elif task.task_type == "code":
        code_data = task_data.get("code_data", {})
        # create_code_task_view(task, code_data)
    elif task.task_type == 'reflection':
        # Handle reflection task type if needed
        pass

    return JsonResponse({"status": "success", "task_id": task.id}, status=201)


@require_http_methods(["GET"])
def list_tasks_view(request, topic_id=None):
    """List all tasks, optionally filtered by topic."""
    if topic_id:
        get_object_or_404(Topic, id=topic_id)
        tasks_qs = Task.objects.filter(topic_id=topic_id)
    else:
        tasks_qs = Task.objects.all()

    tasks = [serialize_task(task) for task in tasks_qs]
    return JsonResponse({"tasks": tasks}, status=200)


@require_http_methods(["GET"])
def get_task_view(request, task_id):
    """Retrieve a single task by its ID."""
    task = get_object_or_404(Task, id=task_id)
    return JsonResponse(serialize_task(task), status=200)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@transaction.atomic
def update_task_view(request, task_id):
    """Update an existing task."""
    task = get_object_or_404(Task, id=task_id)
    data = json.loads(request.body.decode("utf-8"))

    if "topic_id" in data:
        topic = get_object_or_404(Topic, id=data["topic_id"])
        task.topic = topic

    for field in ["name", "description", "task_type", "is_mandatory", "submission_format", "max_score", "unlocks_next_topic", "first_deadline", "second_deadline", "third_deadline"]:
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
