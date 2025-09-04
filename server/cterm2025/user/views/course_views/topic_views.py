# views/topic_views.py
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from user.models.course_model import Course, Topic, Module

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_topic_view(request, module_id, course_id):
    """Create a new topic for a given module."""

    if not module_id or not course_id:
        return JsonResponse({"error": "Missing module_id or course_id"}, status=400)

    data = json.loads(request.body)
    name = data.get("name")
    order_index = data.get("order_index")

    valid_fields = [name, order_index]
    invalid_fields = [field for field in valid_fields if not field]
    if invalid_fields:
        return JsonResponse({"error": f"Missing required fields: {', '.join(invalid_fields)}"}, status=400)

    module = Module.objects.filter(id=module_id).first()
    if not module:
        return JsonResponse({"error": "Module not found"}, status=404)
    course = Course.objects.filter(id=course_id).first()
    if not course:
        return JsonResponse({"error": "Course not found"}, status=404)
    
    if name and Topic.objects.filter(name=name, module=module).exists():
        return JsonResponse({"error": "Topic with this name already exists in the module"}, status=400)

    topic = Topic.objects.create(
        module=module,
        name=name,
        order_index=int(order_index),
        resource_url=data.get("resource_url", "")
    )

    return JsonResponse({"status": "success", "topic_id": topic.id}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_topics_view(request, module_id, course_id):
    """List all topics for a given module."""
    module = Module.objects.filter(id=module_id).first()
    if not module:
        return JsonResponse({"error": "Module not found"}, status=404)
    course = Course.objects.filter(id=course_id).first()
    if not course:
        return JsonResponse({"error": "Course not found"}, status=404)
    topics = Topic.objects.filter(module=module).order_by("order_index").values()
    return JsonResponse(list(topics), safe=False, status=200)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_topic_view(request, topic_id, module_id, course_id):
    """Update an existing topic."""
    if not topic_id or not module_id or not course_id:
        return JsonResponse({"error": "Missing topic_id, module_id or course_id"}, status=400)

    data = json.loads(request.body)
    course = Course.objects.filter(id=course_id).first()
    if not course:
        return JsonResponse({"error": "Course not found"}, status=404)
    module = Module.objects.filter(id=module_id).first()
    if not module:
        return JsonResponse({"error": "No module for this topic"}, status=404)
    topic = Topic.objects.filter(id=topic_id, module=module).first()
    if not topic:
        return JsonResponse({"error": "Topic not found"}, status=404)
    valid_fields = ["name", "order_index", "resource_url"]
    invalid_fields = [field for field in data.keys() if field not in valid_fields]
    if invalid_fields:
        return JsonResponse({"error": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)
    
    for field in valid_fields:
        if field in data:
            setattr(topic, field, data[field])
    topic.save()

    return JsonResponse({"status": "success", "topic": {
        "id": topic.id,
        "name": topic.name,
        "order_index": topic.order_index,
        "resource_url": topic.resource_url,
        "module_id": topic.module.id
    }}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_topic_view(request, module_id, course_id, topic_id):
    """Retrieve a specific topic by ID."""
    module = Module.objects.filter(id=module_id).first()
    if not module:
        return JsonResponse({"error": "Module not found"}, status=404)
    course = Course.objects.filter(id=course_id).first()
    if not course:
        return JsonResponse({"error": "Course not found"}, status=404)
    topic = Topic.objects.filter(id=topic_id, module=module).values().first()
    if not topic:
        return JsonResponse({"error": "Topic not found"}, status=404)
    return JsonResponse(topic, safe=False, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_topic_view(request, topic_id, course_id, module_id):
    """Delete a topic."""

    if not topic_id or not module_id or not course_id:
        return JsonResponse({"error": "Missing topic_id, module_id or course_id"}, status=400)
    course = Course.objects.filter(id=course_id).first()
    if not course:
        return JsonResponse({"error": "Course not found"}, status=404)
    module = Module.objects.filter(id=module_id).first()
    if not module:
        return JsonResponse({"error": "No module for this topic"}, status=404)
    topic = Topic.objects.filter(id=topic_id, module=module).first()
    if not topic:
        return JsonResponse({"error": "Topic not found"}, status=404)
    topic.delete()
    return JsonResponse({"status": "success", "message": "Topic deleted"}, status=200)

