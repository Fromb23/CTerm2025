from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
import json
from user.models.course_model import Task, CodeTask

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_code_task_view(request, task_id):
	"""
	Create a new code task for a specific task.
	Expects JSON data in the request body.
	"""
	data = json.loads(request.body.decode("utf-8"))
	
	task = get_object_or_404(Task, id=task_id)

	code_task = CodeTask.objects.create(
		name=data.get("name", ""),
		description=data.get("description", ""),
		tasks=task,
		language=data.get("language", ""),
		starter_code=data.get("starter_code", ""),
	)

	return JsonResponse({"status": "success", "code_task_id": code_task.id}, status=201)

@require_http_methods(["GET"])
def list_code_tasks_view(request, task_id):
	"""List all code tasks for a specific task."""
	task = get_object_or_404(Task, id=task_id)
	code_tasks = task.code_tasks.all().values()
	return JsonResponse({"code_tasks": list(code_tasks)}, status=200)


@require_http_methods(["GET"])
def get_code_task_view(request, code_task_id):
	"""Retrieve a single code task by its ID."""
	code_task = get_object_or_404(CodeTask, id=code_task_id)
	return JsonResponse({
		"id": code_task.id,
		"name": code_task.name,
		"description": code_task.description,
		"language": code_task.language,
		"starter_code": code_task.starter_code,
		"created_at": code_task.created_at.strftime('%Y-%m-%d %H:%M:%S'),
		"updated_at": code_task.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
	}, status=200)

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def update_code_task_view(request, code_task_id):
	"""Update an existing code task."""
	data = json.loads(request.body.decode("utf-8"))
	code_task = get_object_or_404(CodeTask, id=code_task_id)

	code_task.name = data.get("name", code_task.name)
	code_task.description = data.get("description", code_task.description)
	code_task.language = data.get("language", code_task.language)
	code_task.starter_code = data.get("starter_code", code_task.starter_code)
	code_task.save()

	return JsonResponse({"status": "success", "code_task_id": code_task.id}, status=200)

@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_code_task_view(request, code_task_id):
	"""Delete a code task by its ID."""
	code_task = get_object_or_404(CodeTask, id=code_task_id)
	code_task.delete()
	return JsonResponse({"status": "success", "message": "Code task deleted successfully"}, status=200)