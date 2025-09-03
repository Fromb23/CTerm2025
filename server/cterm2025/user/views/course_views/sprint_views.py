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
		if not course:
			return JsonResponse({"error": "Course not found"}, status=404)

		data = json.loads(request.body.decode("utf-8"))

		existing_sprint_name = Sprint.objects.filter(name=data.get("name"), course_id=course_id).first()
		if existing_sprint_name:
			return JsonResponse({"error": "Sprint with this name already exists for this particular course"}, status=400)

		start_date = parse_date(data.get("start_date"))
		if not start_date:
			return JsonResponse({"error": "Invalid start_date format"}, status=400)

		sprint = Sprint.objects.create(
			name=data.get("name"),
			duration=data.get("duration", 0),
			start_date=start_date,
			description=data.get("description", ""),
			course=course,
			is_active=data.get("is_active", True),
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
        course_exists = Course.objects.filter(id=course_id).exists()
        if not course_exists:
            return JsonResponse({"error": "Course not found"}, status=404)

        sprints = list(Sprint.objects.filter(course_id=course_id).values())
        if not sprints:
            return JsonResponse({"message": "No sprint for this course"}, status=200)
    else:
        sprints = list(Sprint.objects.values())

    return JsonResponse({"sprints": sprints}, status=200)

def update_sprint_view(request, sprint_id, course_id):
    """Update an existing sprint under a specific course."""
    if request.method not in ["PATCH"]:
        return JsonResponse({"error": "Only PATCH method allowed"}, status=405)

    try:
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return JsonResponse({"error": "Course not found"}, status=404)

        try:
            sprint = Sprint.objects.get(id=sprint_id, course=course)
        except Sprint.DoesNotExist:
            return JsonResponse({"error": "Sprint not found for this course"}, status=404)

        data = json.loads(request.body.decode("utf-8"))
        for field in ["name", "duration", "start_date", "description", "is_active"]:
            if field in data:
                setattr(sprint, field, data[field])

        sprint.save()
        return JsonResponse({"status": "success", "sprint_id": sprint.id}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def list_sprint_view(request, sprint_id, course_id):
    """Retrieve a single sprint by sprint_id under a specific course."""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method allowed"}, status=405)

    if not course_id:
        return JsonResponse({"error": "courseId is required"}, status=400)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse({"error": "Course not found"}, status=404)

    if not sprint_id:
        return JsonResponse({"error": "sprintId is required"}, status=400)

    try:
        sprint = Sprint.objects.get(id=sprint_id, course=course)
    except Sprint.DoesNotExist:
        return JsonResponse({"error": "Sprint not found for this course"}, status=404)

    return JsonResponse({
        "id": sprint.id,
        "name": sprint.name,
        "duration": sprint.duration,
        "start_date": sprint.start_date,
        "description": sprint.description,
        "course_id": sprint.course.id,
        "is_active": sprint.is_active,
    }, status=200)


@csrf_exempt
@transaction.atomic
def update_sprint_view(request, sprint_id, course_id):
    """Update an existing sprint (partial update with PATCH)."""
    if request.method != "PATCH":
        return JsonResponse({"error": "Only PATCH method allowed"}, status=405)

    if not course_id or not sprint_id:
        return JsonResponse({"error": "courseId and sprintId are required"}, status=400)

    try:
        try:
            existing_course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return JsonResponse({"error": "Course not found"}, status=404)

        try:
            sprint = Sprint.objects.get(id=sprint_id, course=existing_course)
        except Sprint.DoesNotExist:
            return JsonResponse({"error": "Sprint not found for this course"}, status=404)

        data = json.loads(request.body.decode("utf-8"))
        valid_fields = ["name", "duration", "start_date", "description", "is_active"]
        invalid_fields = [field for field in data if field not in valid_fields]
        if invalid_fields:
            return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

        for field in valid_fields:
            if field in data:
                setattr(sprint, field, data[field])

        sprint.save()
        return JsonResponse({"status": "success", "sprint_id": sprint.id}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@transaction.atomic
def delete_sprint_view(request, sprint_id, course_id):
    """Delete a sprint under a specific course."""
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE method allowed"}, status=405)

    try:
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return JsonResponse({"error": "Course not found"}, status=404)

        try:
            sprint = Sprint.objects.get(id=sprint_id, course=course)
        except Sprint.DoesNotExist:
            return JsonResponse(
                {"error": "Sprint not found for this course"},
                status=404
            )

        sprint.delete()
        return JsonResponse(
            {
                "status": "success",
                "message": f"Sprint {sprint_id} deleted from course {course_id}",
            },
            status=200,
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)