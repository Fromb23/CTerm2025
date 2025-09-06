from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date
import json
from user.models.course_model import Project, Sprint
from user.utils.serialize_task import serialize_task

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_project_view(request):
    """Create a new project container only - no tasks."""
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    valid_fields = ["name", "description", "start_date", "end_date", "is_active", "sprint_id"]
    invalid_fields = [field for field in data if field not in valid_fields]
    if invalid_fields:
        return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

    name = data.get("name")
    if not name:
        return JsonResponse({"error": "Project name is required"}, status=400)

    start_date = data.get("start_date")
    if not start_date:
        return JsonResponse({"error": "Start date is required"}, status=400)

    sprint_id = data.get("sprint_id")
    if not sprint_id:
        return JsonResponse({"error": "sprint_id is required"}, status=400)

    name_exists = Project.objects.filter(name=name).exists()
    if name_exists:
        return JsonResponse({"error": "Project with this name already exists."}, status=400)

    sprint = Sprint.objects.filter(id=sprint_id).first()
    if not sprint:
        return JsonResponse({"error": "Sprint not found"}, status=404)

    try:
        project = Project.objects.create(
            name=name,
            description=data.get("description", ""),
            start_date=start_date,
            end_date=data.get("end_date"),
            is_active=bool(data.get("is_active", True)),
            sprint=sprint,
        )

        return JsonResponse({
            "status": "success", 
            "project": {
                "id": project.id,
                "name": project.name,
                "start_date": project.start_date,
                "end_date": project.end_date,
                "is_active": project.is_active,
                "sprint_id": project.sprint.id
            },
            "message": f"Project '{name}' created successfully."
        }, status=201)

    except Exception as e:
        return JsonResponse({
            "error": f"Failed to create project: {str(e)}"
        }, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def list_projects_view(request):
    """List all projects with their tasks and related task types."""
    projects_qs = Project.objects.all()

    projects = []
    for project in projects_qs:
        tasks = [serialize_task(task) for task in project.tasks.all()]

        projects.append({
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "start_date": project.start_date.isoformat() if project.start_date else None,
            "end_date": project.end_date.isoformat() if project.end_date else None,
            "is_active": project.is_active,
            "sprint_id": project.sprint.id if project.sprint else None,
            "tasks": tasks,
        })

    return JsonResponse({"projects": projects}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def list_project_view(request, project_id):
    """Retrieve a single project by its ID."""
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
    tasks = [serialize_task(task) for task in project.tasks.all()]

    return JsonResponse({
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "start_date": project.start_date.isoformat() if project.start_date else None,
            "end_date": project.end_date.isoformat() if project.end_date else None,
            "is_active": project.is_active,
            "sprint_id": project.sprint.id if project.sprint else None,
            "tasks": tasks,
        }
    }, status=200)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_project_view(request, project_id):
    """Update a project (tasks not touched here)."""
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
        
    data = json.loads(request.body.decode("utf-8"))

    valid_fields = ["name", "description", "start_date", "end_date", "is_active", "sprint_id"]
    invalid_fields = [field for field in data if field not in valid_fields]
    if invalid_fields:
        return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

    project.name = data.get("name", project.name)
    project.description = data.get("description", project.description)
    

    if "start_date" in data:
        if data["start_date"] is None:
            project.start_date = None
        else:
            project.start_date = parse_date(data["start_date"]) or project.start_date
            
    if "end_date" in data:
        if data["end_date"] is None:
            project.end_date = None
        else:
            project.end_date = parse_date(data["end_date"]) or project.end_date
    
    project.is_active = bool(data.get("is_active", project.is_active))

    if "sprint_id" in data:
        if data["sprint_id"] is None:
            project.sprint = None
        else:
            project.sprint = get_object_or_404(Sprint, id=data["sprint_id"])

    project.save()
    return JsonResponse({"status": "success", "project": {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "start_date": project.start_date.isoformat() if project.start_date else None,
        "end_date": project.end_date.isoformat() if project.end_date else None,
        "is_active": project.is_active,
        "sprint_id": project.sprint.id if project.sprint else None,
        "tasks": [serialize_task(task) for task in project.tasks.all()],
    }}, status=200)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_project_view(request, project_id):
    """Delete a project."""
    if not project_id:
        return JsonResponse({"error": "projectId is required"}, status=400)
    try:
        project = Project.objects.get(id=project_id)
        project.delete()
    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
	
    return JsonResponse({"status": "success", "message": "Project deleted successfully"}, status=204)