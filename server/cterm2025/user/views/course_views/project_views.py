from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from user.models.course_model import Project, Task, Sprint
from user.views.course_views.task_views import create_task_view
from user.utils.serialize_task import serialize_task

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_project_view(request):
    """Create a new project and call task view for each task."""
    data = json.loads(request.body.decode("utf-8"))

    sprint_id = data.get("sprint_id")
    if not sprint_id:
        return JsonResponse({"error": "sprint_id is required"}, status=400)

    sprint = get_object_or_404(Sprint, id=sprint_id)

    try:
        project = Project.objects.create(
            name=data.get("name", ""),
            description=data.get("description", ""),
            start_date=data.get("start_date"),
            end_date=data.get("end_date"),
            is_active=bool(data.get("is_active", True)),
            sprint=sprint,
        )

        tasks_data = data.get("tasks", [])
        for task_info in tasks_data:
            task_info["project_id"] = project.id
            create_task_view(request, task_info)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"status": "success", "project_id": project.id}, status=201)

@require_http_methods(["GET"])
def list_projects_view(request):
	"""List all projects."""
	projects = list(Project.objects.values())
	return JsonResponse({"projects": projects}, status=200)

@require_http_methods(["GET"])
def list_projects_view(request):
    """List all projects with their tasks and related task types."""
    projects_qs = Project.objects.all()

    projects = []
    for project in projects_qs:
        tasks = [serialize_task(task) for task in project.task_set.all()]

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

@require_http_methods(["PUT", "PATCH"])
def update_project_view(request, project_id):
    """Update a project (tasks not touched here)."""
    project = get_object_or_404(Project, id=project_id)
    data = json.loads(request.body.decode("utf-8"))

    project.name = data.get("name", project.name)
    project.description = data.get("description", project.description)
    project.start_date = data.get("start_date", project.start_date)
    project.end_date = data.get("end_date", project.end_date)
    project.is_active = bool(data.get("is_active", project.is_active))

    if "sprint_id" in data:
        project.sprint = get_object_or_404(Sprint, id=data["sprint_id"])

    project.save()
    return JsonResponse({"status": "success"}, status=200)


@require_http_methods(["DELETE"])
def delete_project_view(request, project_id):
	"""Delete a project."""
	project = get_object_or_404(Project, id=project_id)
	project.delete()
	return JsonResponse({"status": "success"}, status=204)