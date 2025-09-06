from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from user.models import ProjectProgress

@csrf_exempt
def create_project_progress(request):
    if request.method == "POST":
        data = json.loads(request.body)
        progress = ProjectProgress.objects.create(
            student_id=data["student_id"],
            project_title=data["project_title"],
            description=data.get("description", ""),
            status=data.get("status", "pending"),
            progress_percentage=data.get("progress_percentage", 0)
        )
        return JsonResponse({"id": progress.id, "message": "Project progress created successfully."}, status=201)

def get_all_project_progress(request):
    if request.method == "GET":
        progresses = list(ProjectProgress.objects.values())
        return JsonResponse(progresses, safe=False)

def get_project_progress(request, progress_id):
    if request.method == "GET":
        progress = get_object_or_404(ProjectProgress, id=progress_id)
        return JsonResponse({
            "id": progress.id,
            "student_id": progress.student_id,
            "project_title": progress.project_title,
            "description": progress.description,
            "status": progress.status,
            "progress_percentage": progress.progress_percentage,
            "created_at": progress.created_at,
            "updated_at": progress.updated_at
        })

@csrf_exempt
def update_project_progress(request, progress_id):
    if request.method == "PUT":
        progress = get_object_or_404(ProjectProgress, id=progress_id)
        data = json.loads(request.body)

        progress.project_title = data.get("project_title", progress.project_title)
        progress.description = data.get("description", progress.description)
        progress.status = data.get("status", progress.status)
        progress.progress_percentage = data.get("progress_percentage", progress.progress_percentage)
        progress.save()

        return JsonResponse({"message": "Project progress updated successfully."})

@csrf_exempt
def delete_project_progress(request, progress_id):
    if request.method == "DELETE":
        progress = get_object_or_404(ProjectProgress, id=progress_id)
        progress.delete()
        return JsonResponse({"message": "Project progress deleted successfully."})
