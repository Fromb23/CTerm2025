# views/topic_views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from user.models.course_model import Topic, Module

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_topic_view(request):
    """Create a new topic for a given module."""
    title = request.POST.get("title")
    module_id = request.POST.get("module_id")
    order_index = request.POST.get("order_index")

    if not title or not module_id or not order_index:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    module = get_object_or_404(Module, id=module_id)

    topic = Topic.objects.create(
        module=module,
        name="name",
        order_index=int(order_index),
        resource_url=request.POST.get("resource_url", ""),
        created_at=request.POST.get("created_at", None),
        updated_at=request.POST.get("updated_at", None)
    )

    return JsonResponse({"status": "success", "topic_id": topic.id}, status=201)


@csrf_exempt
@require_http_methods(["GET"])
def list_topics_view(request, module_id):
    """List all topics for a given module."""
    module = get_object_or_404(Module, id=module_id)
    topics = Topic.objects.filter(module=module).order_by("order_index").values()
    return JsonResponse(list(topics), safe=False, status=200)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@transaction.atomic
def update_topic_view(request, topic_id):
    """Update an existing topic."""
    topic = get_object_or_404(Topic, id=topic_id)

    if request.method == "PUT" or request.method == "PATCH":
        name = request.POST.get("name")
        order_index = request.POST.get("order_index")
        resource_url = request.POST.get("resource_url")

        if not name or not order_index:
            return JsonResponse({"error": "Missing required fields"}, status=400)

        topic.name = name
        topic.order_index = int(order_index)
        topic.resource_url = resource_url
        topic.save()

    elif request.method == "PATCH":
        if "name" in request.POST:
            topic.name = request.POST["name"]
        if "order_index" in request.POST:
            topic.order_index = int(request.POST["order_index"])
        if "resource_url" in request.POST:
            topic.resource_url = request.POST["resource_url"]
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
