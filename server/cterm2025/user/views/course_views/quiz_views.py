from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
import json
from user.models.course_model import Task, Quiz

def create_quiz_view(request, task_id):
	"""
	Create a new quiz for a task.
	Expects JSON data in the request body.
	"""
	data = json.loads(request.body.decode("utf-8"))
	
	task = get_object_or_404(Task, id=task_id)

	quiz = Quiz.objects.create(
		name=data.get("name", ""),
		description=data.get("description", ""),
		total_marks=data.get("total_marks", 0),
		tasks=task,
	)

	return JsonResponse({"status": "success", "quiz_id": quiz.id}, status=201)

@require_http_methods(["GET"])
def list_quizzes_view(request, task_id):
	"""List all quizzes for a specific task."""
	task = get_object_or_404(Task, id=task_id)
	quizzes = task.quizzes.all().values()
	return JsonResponse({"quizzes": list(quizzes)}, status=200)

@require_http_methods(["GET"])
def get_quiz_view(request, quiz_id):
	"""Retrieve a single quiz by its ID."""
	quiz = get_object_or_404(Quiz, id=quiz_id)
	return JsonResponse({
		"id": quiz.id,
		"name": quiz.name,
		"description": quiz.description,
		"total_marks": quiz.total_marks,
		"created_at": quiz.created_at.strftime('%Y-%m-%d %H:%M:%S'),
		"updated_at": quiz.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
	}, status=200)

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def update_quiz_view(request, quiz_id):
	"""Update an existing quiz."""
	data = json.loads(request.body.decode("utf-8"))
	quiz = get_object_or_404(Quiz, id=quiz_id)

	quiz.name = data.get("name", quiz.name)
	quiz.description = data.get("description", quiz.description)
	quiz.total_marks = data.get("total_marks", quiz.total_marks)
	quiz.save()

	return JsonResponse({"status": "success", "quiz_id": quiz.id}, status=200)

@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_quiz_view(request, quiz_id):
	"""Delete a quiz by its ID."""
	quiz = get_object_or_404(Quiz, id=quiz_id)
	quiz.delete()
	return JsonResponse({"status": "success", "message": "Quiz deleted successfully"}, status=204)