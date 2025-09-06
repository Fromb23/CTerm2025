import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils.dateparse import parse_datetime
from user.models.course_enrollment import ModuleProgress, TopicProgress
from user.models.course_model import Topic


@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_topic_progress_view(request):
    """Create a topic progress record for a learner inside a module."""
    try:
        data = json.loads(request.body.decode("utf-8"))
        module_progress_id = data.get("module_progress_id")
        topic_id = data.get("topic_id")

        if not module_progress_id or not topic_id:
            return JsonResponse({"error": "module_progress_id and topic_id are required"}, status=400)

        module_progress = get_object_or_404(ModuleProgress, id=module_progress_id)
        topic = get_object_or_404(Topic, id=topic_id)

        # Ensure unique constraint is respected
        progress, created = TopicProgress.objects.get_or_create(
            module_progress=module_progress,
            topic=topic,
            defaults={"status": "not_started"}
        )
        if not created:
            return JsonResponse({"error": "Topic progress already exists"}, status=400)

        return JsonResponse({"status": "success", "progress_id": str(progress.id)}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
@transaction.atomic
def update_topic_progress_view(request, progress_id):
    """Update topic progress record - mark complete, update status, timestamps."""
    progress = get_object_or_404(TopicProgress, id=progress_id)
    try:
        data = json.loads(request.body.decode("utf-8"))

        if "status" in data:
            if data["status"] not in dict(TopicProgress.STATUS_CHOICES):
                return JsonResponse({"error": f"Invalid status: {data['status']}"}, status=400)
            progress.status = data["status"]

        if "started_on" in data:
            progress.started_on = parse_datetime(data["started_on"])
        if "completed_on" in data:
            progress.completed_on = parse_datetime(data["completed_on"])

        progress.save()
        return JsonResponse({"status": "success", "progress_id": str(progress.id)}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def list_topic_progress_view(request):
    """List topic progress records - filterable by module_progress_id or topic_id."""
    module_progress_id = request.GET.get("module_progress_id")
    topic_id = request.GET.get("topic_id")

    qs = TopicProgress.objects.all()
    if module_progress_id:
        qs = qs.filter(module_progress_id=module_progress_id)
    if topic_id:
        qs = qs.filter(topic_id=topic_id)

    data = [
        {
            "id": str(p.id),
            "module_progress_id": str(p.module_progress.id),
            "topic_id": str(p.topic.id),
            "status": p.status,
            "started_on": p.started_on.isoformat() if p.started_on else None,
            "completed_on": p.completed_on.isoformat() if p.completed_on else None,
            "updated_at": p.updated_at.isoformat(),
        }
        for p in qs
    ]
    return JsonResponse({"progress": data}, status=200)


@require_http_methods(["GET"])
def get_topic_progress_view(request, progress_id):
    """Retrieve a specific topic progress record."""
    progress = get_object_or_404(TopicProgress, id=progress_id)
    data = {
        "id": str(progress.id),
        "module_progress_id": str(progress.module_progress.id),
        "topic_id": str(progress.topic.id),
        "status": progress.status,
        "started_on": progress.started_on.isoformat() if progress.started_on else None,
        "completed_on": progress.completed_on.isoformat() if progress.completed_on else None,
        "updated_at": progress.updated_at.isoformat(),
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
