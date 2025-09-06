# views/subtopic_progress_views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils.dateparse import parse_datetime

from user.models.course_enrollment import SubTopicProgress, TopicProgress
from user.models.course_model import SubTopic


@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_subtopic_progress_view(request):
    """Create a subtopic progress record for a learner under a topic."""
    try:
        data = json.loads(request.body.decode("utf-8"))
        topic_progress_id = data.get("topic_progress_id")
        subtopic_id = data.get("subtopic_id")

        if not topic_progress_id or not subtopic_id:
            return JsonResponse({"error": "topic_progress_id and subtopic_id are required"}, status=400)

        topic_progress = get_object_or_404(TopicProgress, id=topic_progress_id)
        subtopic = get_object_or_404(SubTopic, id=subtopic_id)

        progress, created = SubTopicProgress.objects.get_or_create(
            topic_progress=topic_progress,
            subtopic=subtopic,
        )
        if not created:
            return JsonResponse({"error": "Subtopic progress already exists"}, status=400)

        return JsonResponse({"status": "success", "progress_id": progress.id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
@transaction.atomic
def update_subtopic_progress_view(request, progress_id):
    """Update subtopic progress (status, start/end times)."""
    progress = get_object_or_404(SubTopicProgress, id=progress_id)
    try:
        data = json.loads(request.body.decode("utf-8"))

        if "status" in data:
            if data["status"] not in dict(SubTopicProgress.STATUS_CHOICES):
                return JsonResponse({"error": f"Invalid status: {data['status']}"}, status=400)
            progress.status = data["status"]

        if "started_on" in data:
            progress.started_on = parse_datetime(data["started_on"])
        if "completed_on" in data:
            progress.completed_on = parse_datetime(data["completed_on"])

        progress.save()

        # 🔹 Optional cascade: update TopicProgress if all subtopics are complete
        if progress.status == "completed":
            siblings = progress.topic_progress.subtopic_progresses.all()
            if all(s.status == "completed" for s in siblings):
                tp = progress.topic_progress
                tp.status = "completed"
                tp.completed_on = progress.completed_on
                tp.save()

        return JsonResponse({"status": "success", "progress_id": progress.id}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def list_subtopic_progress_view(request):
    """List subtopic progress records with optional filters."""
    topic_progress_id = request.GET.get("topic_progress_id")
    subtopic_id = request.GET.get("subtopic_id")

    qs = SubTopicProgress.objects.all()
    if topic_progress_id:
        qs = qs.filter(topic_progress_id=topic_progress_id)
    if subtopic_id:
        qs = qs.filter(subtopic_id=subtopic_id)

    progress_list = list(qs.values())
    return JsonResponse({"progress": progress_list}, status=200)


@require_http_methods(["GET"])
def get_subtopic_progress_view(request, progress_id):
    """Retrieve a specific subtopic progress record."""
    progress = get_object_or_404(SubTopicProgress, id=progress_id)
    data = {
        "id": progress.id,
        "topic_progress_id": progress.topic_progress.id,
        "subtopic_id": progress.subtopic.id,
        "status": progress.status,
        "started_on": progress.started_on,
        "completed_on": progress.completed_on,
        "updated_at": progress.updated_at,
    }
    return JsonResponse(data, status=200)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_subtopic_progress_view(request, progress_id):
    """Delete a subtopic progress record."""
    progress = get_object_or_404(SubTopicProgress, id=progress_id)
    progress.delete()
    return JsonResponse({"status": "success", "message": "Subtopic progress deleted"}, status=200)
