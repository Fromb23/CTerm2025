from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
from django.utils.dateparse import parse_date
from django.db import transaction
from user.models.course_model import Sprint, Course

@csrf_exempt
@transaction.atomic
def create_sprint_view(request, course_id):
	"""Create a new sprint under a course."""
	if request.method != "POST":
		return JsonResponse({"error": "Only POST method allowed"}, status=405)

	try:
		if not course_id:
			return JsonResponse({"error": "courseId is required"}, status=400)

		course = get_object_or_404(Course, id=course_id)

		sprint = Sprint.objects.create(
			name=request.POST.get("name"),
			duration=request.POST.get("duration", 0),
			start_date=parse_date(request.POST.get("start_date")),
			description=request.POST.get("description", ""),
			course=course,
			is_active=request.POST.get("is_active", True),
		)
		return JsonResponse({"status": "success", "sprint_id": sprint.id}, status=201)
	except Exception as e:
		print("Error creating sprint:", e)
		return JsonResponse({"error": str(e)}, status=500)
	
def list_sprints_view(request, course_id=None):
	"""List all sprints or sprints for a specific course."""
	if request.method != "GET":
		return JsonResponse({"error": "Only GET method allowed"}, status=405)

	if course_id:
		get_object_or_404(Course, id=course_id)
		sprints = list(Sprint.objects.filter(course_id=course_id).values())
	else:
		sprints = list(Sprint.objects.values())

	return JsonResponse({"sprints": sprints}, status=200)

def get_sprint_view(request, sprint_id):
	"""Retrieve a single sprint."""
	if request.method != "GET":
		return JsonResponse({"error": "Only GET method allowed"}, status=405)

	sprint = get_object_or_404(Sprint, id=sprint_id)
	return JsonResponse({
		"id": sprint.id,
		"name": sprint.name,
		"duration": sprint.duration,
		"start_date": sprint.start_date,
		"description": sprint.description,
		"course_id": sprint.course.id,
		"is_active": sprint.is_active,
	}, status=200)

def get_sprints_by_course_view(request, course_id):
	"""Retrieve all sprints for a specific course."""
	if request.method != "GET":
		return JsonResponse({"error": "Only GET method allowed"}, status=405)

	course = get_object_or_404(Course, id=course_id)
	sprints = list(course.sprints.values())
	return JsonResponse({"sprints": sprints}, status=200)

@csrf_exempt
@transaction.atomic
def update_sprint_view(request, sprint_id):
	"""Update an existing sprint."""
	if request.method not in ["PUT", "PATCH"]:
		return JsonResponse({"error": "Only PUT or PATCH method allowed"}, status=405)

	try:
		data = json.loads(request.body.decode("utf-8"))
		sprint = get_object_or_404(Sprint, id=sprint_id)

		for field in ["name", "duration", "start_date", "description", "is_active"]:
			if field in data:
				setattr(sprint, field, data[field])

		sprint.save()
		return JsonResponse({"status": "success", "sprint_id": sprint.id}, status=200)
	except Exception as e:
		return JsonResponse({"error": str(e)}, status=500)
	
@csrf_exempt
@transaction.atomic
def delete_sprint_view(request, sprint_id):
	"""Delete a sprint."""
	if request.method != "DELETE":
		return JsonResponse({"error": "Only DELETE method allowed"}, status=405)

	sprint = get_object_or_404(Sprint, id=sprint_id)
	sprint.delete()
	return JsonResponse({"status": "success", "sprint_id": sprint_id}, status=204)