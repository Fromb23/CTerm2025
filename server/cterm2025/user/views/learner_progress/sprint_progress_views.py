from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.utils import timezone
from django.shortcuts import get_object_or_404
import json
from user.models import CourseEnrollment, SprintProgress, Sprint

@csrf_exempt
@require_http_methods(["POST"])
def create_sprint_progress_view(request):
    """Create sprint progress for an enrollment in a course."""
    try:
        data = json.loads(request.body.decode("utf-8"))
        enrollment_id = data.get("enrollment_id")
        sprint_id = data.get("sprint_id")

        if not enrollment_id or not sprint_id:
            return JsonResponse({"error": "enrollment_id and sprint_id are required"}, status=400)

        enrollment = get_object_or_404(CourseEnrollment, id=enrollment_id)
        sprint = get_object_or_404(Sprint, id=sprint_id)

        progress, created = SprintProgress.objects.get_or_create(
            enrollment=enrollment,
            sprint=sprint,
            defaults={"status": "not_started"}
        )

        if not created:
            return JsonResponse({"error": "Sprint progress already exists"}, status=400)

        return JsonResponse({
            "status": "success",
            "progress_id": str(progress.id),
            "progress_status": progress.status,
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def list_sprint_progress_view(request):
    """List sprint progresses, filter by enrollment_id or sprint_id."""
    enrollment_id = request.GET.get("enrollment_id")
    sprint_id = request.GET.get("sprint_id")

    progresses = SprintProgress.objects.all()
    if enrollment_id:
        progresses = progresses.filter(enrollment_id=enrollment_id)
    if sprint_id:
        progresses = progresses.filter(sprint_id=sprint_id)

    data = [
        {
            "id": str(p.id),
            "enrollment_id": str(p.enrollment.id),
            "sprint_id": str(p.sprint.id),
            "status": p.status,
            "completion_percentage": p.completion_percentage,
            "started_on": p.started_on.isoformat() if p.started_on else None,
            "completed_on": p.completed_on.isoformat() if p.completed_on else None,
        }
        for p in progresses
    ]

    return JsonResponse({"progresses": data}, status=200)


@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
@transaction.atomic
def update_sprint_progress_view(request, progress_id):
    """Update sprint progress (status, completion, percentage)."""
    progress = get_object_or_404(SprintProgress, id=progress_id)

    try:
        data = json.loads(request.body.decode("utf-8"))

        status = data.get("status")
        if status:
            if status not in dict(SprintProgress.STATUS_CHOICES):
                return JsonResponse({"error": f"Invalid status: {status}"}, status=400)
            progress.status = status

            if status == "in_progress" and not progress.started_on:
                progress.started_on = timezone.now()
            if status == "completed":
                progress.completed_on = timezone.now()
                progress.completion_percentage = 100.0

        completion_percentage = data.get("completion_percentage")
        if completion_percentage is not None:
            progress.completion_percentage = float(completion_percentage)

        progress.save()
        return JsonResponse({"status": "success"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
@transaction.atomic
def update_sprint_progress_view(request, progress_id):
    """Update sprint progress (status, completion, percentage)."""
    progress = get_object_or_404(SprintProgress, id=progress_id)

    try:
        data = json.loads(request.body.decode("utf-8"))

        status = data.get("status")
        if status:
            if status not in dict(SprintProgress.STATUS_CHOICES):
                return JsonResponse({"error": f"Invalid status: {status}"}, status=400)
            progress.status = status

            if status == "in_progress" and not progress.started_on:
                progress.started_on = timezone.now()
            if status == "completed":
                progress.completed_on = timezone.now()
                progress.completion_percentage = 100.0

        completion_percentage = data.get("completion_percentage")
        if completion_percentage is not None:
            progress.completion_percentage = float(completion_percentage)

        progress.save()
        return JsonResponse({"status": "success"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_sprint_progress_view(request, progress_id):
    """Delete sprint progress record."""
    progress = get_object_or_404(SprintProgress, id=progress_id)
    progress.delete()
    return JsonResponse({"status": "success", "message": "Sprint progress deleted"}, status=200)
