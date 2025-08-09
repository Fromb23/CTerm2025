# views/topic_views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from models.course_model import Topic, Content


@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_topic_view(request):
    """Create a new topic for a given content."""
    title = request.POST.get("title")
    content_id = request.POST.get("content_id")
    order_index = request.POST.get("order_index")

    if not title or not content_id or not order_index:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    content = get_object_or_404(Content, id=content_id)

    topic = Topic.objects.create(
        content=content,
        title=title,
        description=request.POST.get("description", ""),
        order_index=int(order_index),
        is_optional=request.POST.get("is_optional", "false").lower() == "true",
        estimated_minutes=request.POST.get("estimated_minutes") or None,
        prerequisite_topic_id=request.POST.get("prerequisite_topic_id") or None,
        has_quiz=request.POST.get("has_quiz", "false").lower() == "true",
        quiz_passing_score=request.POST.get("quiz_passing_score") or 70,
    )

    return JsonResponse({"status": "success", "topic_id": topic.id}, status=201)


@csrf_exempt
@require_http_methods(["GET"])
def list_topics_view(request, content_id):
    """List all topics for a given content."""
    content = get_object_or_404(Content, id=content_id)
    topics = Topic.objects.filter(content=content).order_by("order_index").values()
    return JsonResponse(list(topics), safe=False, status=200)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@transaction.atomic
def update_topic_view(request, topic_id):
    """Update an existing topic."""
    topic = get_object_or_404(Topic, id=topic_id)

    data = request.POST
    if "title" in data:
        topic.title = data["title"]
    if "description" in data:
        topic.description = data["description"]
    if "order_index" in data:
        topic.order_index = int(data["order_index"])
    if "is_optional" in data:
        topic.is_optional = data["is_optional"].lower() == "true"
    if "estimated_minutes" in data:
        topic.estimated_minutes = data["estimated_minutes"] or None
    if "prerequisite_topic_id" in data:
        topic.prerequisite_topic_id = data["prerequisite_topic_id"] or None
    if "has_quiz" in data:
        topic.has_quiz = data["has_quiz"].lower() == "true"
    if "quiz_passing_score" in data:
        topic.quiz_passing_score = int(data["quiz_passing_score"])

    topic.save()
    return JsonResponse({"status": "success", "topic_id": topic.id}, status=200)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_topic_view(request, topic_id):
    """Delete a topic."""
    topic = get_object_or_404(Topic, id=topic_id)
    topic.delete()
    return JsonResponse({"status": "success", "message": "Topic deleted"}, status=200)
