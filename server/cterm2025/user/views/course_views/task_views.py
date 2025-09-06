# views/task_views.py
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from user.models.course_model import Task, Topic, Project
from .quiz_views import create_quiz_view, update_quiz_view
from user.utils.serialize_task import serialize_task

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_task_view(request):
    """
    Create a new task.
    Handles quiz creation if task_type is 'quiz'.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    base_valid_fields = ["name", "task_type", "description", "is_mandatory", "submission_format", 
                        "max_score", "first_deadline", "second_deadline", "third_deadline", 
                        "unlocks_next_topic", "project_id", "topic_id"]
    
    valid_fields = base_valid_fields + (["quiz"] if data.get("task_type") == "quiz" else [])
    
    invalid_fields = [field for field in data if field not in valid_fields]
    if invalid_fields:
        return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

    name = data.get("name")
    if not name:
        return JsonResponse({"error": "Task name is required."}, status=400)

    task_type = data.get("task_type")
    if not task_type:
        return JsonResponse({"error": "Task type is required."}, status=400)

    if data.get("project_id"):
        task_exists = Task.objects.filter(name=name, project_id=data.get("project_id")).exists()
    else:
        task_exists = Task.objects.filter(name=name).exists()

    if task_exists:
        return JsonResponse({"error": "Task with this name already exists."}, status=400)

    topic = None
    if data.get("topic_id"):
        topic = get_object_or_404(Topic, id=data.get("topic_id"))

    project = None
    if data.get("project_id"):
        project = get_object_or_404(Project, id=data.get("project_id"))

    try:
        task = Task.objects.create(
            project=project,
            topic=topic,
            name=name,
            task_type=task_type,
            description=data.get("description", ""),
            is_mandatory=bool(data.get("is_mandatory", True)),
            submission_format=data.get("submission_format", ""),
            max_score=data.get("max_score"),
            first_deadline=data.get("first_deadline"),
            second_deadline=data.get("second_deadline"),
            third_deadline=data.get("third_deadline"),
            unlocks_next_topic=bool(data.get("unlocks_next_topic", True))
        )

        if task.task_type == "quiz":
            quiz_data = data.get("quiz", {})
            if quiz_data:
                create_quiz_view(task, quiz_data)
            else:
                return JsonResponse({
                    "error": "Quiz data is required for quiz tasks"
                }, status=400)
                
        elif task.task_type == "code":
            code_data = data.get("code", {})
            if code_data:
                # create_code_for_task(task, code_data)  # Uncomment when implemented
                pass
                
        elif task.task_type == 'reflection':
            reflection_data = data.get("reflection", {})
            if reflection_data:
                # create_reflection_for_task(task, reflection_data)  # Uncomment when implemented
                pass

        return JsonResponse({
            "status": "success", 
            "task": {
                "id": task.id,
                "name": task.name,
                "task_type": task.task_type,
                "description": task.description,
                "is_mandatory": task.is_mandatory,
                "submission_format": task.submission_format,
                "max_score": task.max_score,
                "first_deadline": task.first_deadline,
                "second_deadline": task.second_deadline,
                "third_deadline": task.third_deadline,
                "unlocks_next_topic": task.unlocks_next_topic,
                "project_id": task.project.id if task.project else None,
                "topic_id": task.topic.id if task.topic else None,
                "created_at": task.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": task.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            },
            "message": f"{task_type.title()} task created successfully"
        }, status=201)

    except Exception as e:
        return JsonResponse({
            "error": f"Failed to create task: {str(e)}"
        }, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def list_tasks_view(request):
    """List all tasks, optionally filtered by topic."""
   
    tasks_qs = Task.objects.all()

    tasks = [serialize_task(task) for task in tasks_qs]
    return JsonResponse({"tasks": tasks, "status": "success"}, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def list_task_view(request, task_id):
    """Retrieve a single task by its ID."""
    task = Task.objects.filter(id=task_id).first()
    if not task:
        return JsonResponse({"error": "Task not found"}, status=404)
    
    return JsonResponse(serialize_task(task), status=200)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_task_view(request, task_id):
    """Update an existing task with proper PATCH semantics."""
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found"}, status=404)

    base_valid_fields = ["name", "task_type", "description", "is_mandatory", "submission_format", 
                        "max_score", "first_deadline", "second_deadline", "third_deadline", 
                        "unlocks_next_topic", "project_id", "topic_id"]
    
    # Allow quiz field if task is currently quiz OR being changed to quiz
    current_task_type = task.task_type
    new_task_type = data.get("task_type", current_task_type)
    valid_fields = base_valid_fields + (["quiz"] if current_task_type == "quiz" or new_task_type == "quiz" else [])
    
    invalid_fields = [field for field in data if field not in valid_fields]
    if invalid_fields:
        return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

    if "topic_id" in data:
        topic = get_object_or_404(Topic, id=data["topic_id"]) if data["topic_id"] else None
        task.topic = topic
        
    if "project_id" in data:
        project = get_object_or_404(Project, id=data["project_id"]) if data["project_id"] else None
        task.project = project

    try:
        updatable_fields = ["name", "task_type", "description", "is_mandatory", "submission_format", 
                           "max_score", "first_deadline", "second_deadline", "third_deadline", 
                           "unlocks_next_topic"]
        
        for field in updatable_fields:
            if field in data:
                if field in ["is_mandatory", "unlocks_next_topic"]:
                    setattr(task, field, bool(data[field]))
                else:
                    setattr(task, field, data[field])

        task.save()

        if "quiz" in data:
            if task.task_type == "quiz":
                quiz_data = data.get("quiz", {})
                if quiz_data:
                    update_quiz_view(request, quiz_data)
                else:
                    return JsonResponse({
                        "error": "Quiz data cannot be empty when provided for quiz tasks"
                    }, status=400)
            else:
                return JsonResponse({
                    "error": "Cannot update quiz data for non-quiz tasks"
                }, status=400)

        return JsonResponse({
            "status": "success", 
            "task": {
                "id": task.id,
                "name": task.name,
                "task_type": task.task_type,
                "description": task.description,
                "is_mandatory": task.is_mandatory,
                "submission_format": task.submission_format,
                "max_score": task.max_score,
                "first_deadline": task.first_deadline,
                "second_deadline": task.second_deadline,
                "third_deadline": task.third_deadline,
                "unlocks_next_topic": task.unlocks_next_topic,
                "project_id": task.project.id if task.project else None,
                "topic_id": task.topic.id if task.topic else None,
                "created_at": task.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": task.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            },
            "message": "Task updated successfully"
        }, status=200)
        
    except Exception as e:
        return JsonResponse({
            "error": f"Failed to update task: {str(e)}"
        }, status=500)
    

@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_task_view(request, task_id):
    """Delete a task."""
    try:
        if not task_id:
            return JsonResponse({"error": "taskId is required"}, status=400)
        task = Task.objects.get(id=task_id)
        task.delete()
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found"}, status=404)

    return JsonResponse({"status": "success", "message": "Task deleted successfully"}, status=200)
