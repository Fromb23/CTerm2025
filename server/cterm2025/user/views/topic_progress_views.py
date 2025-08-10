# views/topic_progress_views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils.dateparse import parse_datetime
from models.course_model import TopicProgress, Topic, CustomUser

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_topic_progress_view(request):
    """Create a topic progress record or unlock a topic for a user."""
    try:
        data = json.loads(request.body.decode("utf-8"))
        user_id = data.get("user_id")
        topic_id = data.get("topic_id")
        is_unlocked = data.get("is_unlocked", True)

        if not user_id or not topic_id:
            return JsonResponse({"error": "user_id and topic_id are required"}, status=400)

        user = get_object_or_404(CustomUser, id=user_id)
        topic = get_object_or_404(Topic, id=topic_id)

        # Check if progress already exists
        progress, created = TopicProgress.objects.get_or_create(
            user=user,
            topic=topic,
            defaults={"is_unlocked": is_unlocked}
        )
        if not created:
            return JsonResponse({"error": "Topic progress already exists"}, status=400)

        return JsonResponse({"status": "success", "progress_id": progress.id}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
@transaction.atomic
def update_topic_progress_view(request, progress_id):
    """Update topic progress record - mark complete, update scores etc."""
    progress = get_object_or_404(TopicProgress, id=progress_id)
    try:
        data = json.loads(request.body.decode("utf-8"))

        for field in ["is_unlocked", "is_completed"]:
            if field in data:
                setattr(progress, field, data[field])

        # Optional date fields - parse if present
        if "unlocked_at" in data:
            progress.unlocked_at = parse_datetime(data["unlocked_at"])
        if "completed_at" in data:
            progress.completed_at = parse_datetime(data["completed_at"])

        for score_field in ["progress_score", "quiz_score"]:
            if score_field in data:
                setattr(progress, score_field, data[score_field])

        progress.save()
        return JsonResponse({"status": "success", "progress_id": progress.id}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def list_topic_progress_view(request):
    """List topic progress records - can filter by user_id or topic_id."""
    user_id = request.GET.get("user_id")
    topic_id = request.GET.get("topic_id")

    qs = TopicProgress.objects.all()

    if user_id:
        qs = qs.filter(user_id=user_id)
    if topic_id:
        qs = qs.filter(topic_id=topic_id)

    progress_list = list(qs.values())
    return JsonResponse({"progress": progress_list}, status=200)


@require_http_methods(["GET"])
def get_topic_progress_view(request, progress_id):
    """Retrieve a specific topic progress record."""
    progress = get_object_or_404(TopicProgress, id=progress_id)
    data = {
        "id": progress.id,
        "user_id": progress.user.id,
        "topic_id": progress.topic.id,
        "is_unlocked": progress.is_unlocked,
        "is_completed": progress.is_completed,
        "unlocked_at": progress.unlocked_at,
        "completed_at": progress.completed_at,
        "progress_score": progress.progress_score,
        "quiz_score": progress.quiz_score,
        "created_at": progress.created_at,
        "updated_at": progress.updated_at,
    }
    return JsonResponse(data, status=200)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_topic_progress_view(request, progress_id):
    """Delete a topic progress record."""
    progress = get_object_or_404(TopicProgress, id=progress_id)
    progress.delete()
    return JsonResponse({"status": "success", "message": "Topic progress deleted"}, status=200)
