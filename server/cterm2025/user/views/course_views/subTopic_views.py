from django.http import JsonResponse
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from user.models.course_model import Module, SubTopic,Topic, Course


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_subTopic_view(request, topic_id, course_id, module_id):
	"""Create a new sub topic for a given topic."""
	if not topic_id or not course_id or not module_id:
		return JsonResponse({"error": "Missing topic_id, course_id or module_id"}, status=400)

	topic = Topic.objects.filter(id=topic_id).first()
	if not topic:
		return JsonResponse({"error": "Topic not found"}, status=404)
	data = json.loads(request.body)
	valid_fields = ["name", "description", "resource_url"]
	invalid_fields = [field for field in valid_fields if field not in data]
	if invalid_fields:
		return JsonResponse({"error": f"Missing required fields: {', '.join(invalid_fields)}"}, status=400)

	name = data.get("name")
	description = data.get("description", "")
	resource_url = data.get("resource_url", "")

	if SubTopic.objects.filter(name=name).exists():
		return JsonResponse({"error": "Sub Topic with this name already exists"}, status=400)

	sub_topic = SubTopic.objects.create(
		topic_id=topic_id,
		name=name,
		description=description,
		resource_url=resource_url
	)

	return JsonResponse({"status": "success", "sub_topic": {
		"id": sub_topic.id,
		"name": sub_topic.name,
		"description": sub_topic.description,
		"resource_url": sub_topic.resource_url,
		"created_at": sub_topic.created_at.isoformat(),
		"updated_at": sub_topic.updated_at.isoformat(),
		"topic_id": sub_topic.topic.id
	}}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_subTopics_view(request, course_id, module_id, topic_id):
	"""List all sub topics of a given topic."""
	if not topic_id or not module_id or not course_id:
		return JsonResponse({"error": "Missing topic_id, module_id or course_id"}, status=400)
	
	sub_topics = SubTopic.objects.filter(topic_id=topic_id).order_by("id")

	sub_topic_list = [
		{
			"id": sub_topic.id,
			"name": sub_topic.name,
			"resource_url": sub_topic.resource_url,
			"created_at": sub_topic.created_at.isoformat(),
			"updated_at": sub_topic.updated_at.isoformat()
		} for sub_topic in sub_topics
	]

	return JsonResponse({"sub topics": sub_topic_list}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_subTopic_view(request, course_id, module_id, topic_id, sub_topic_id):
	"""Get details of a specific topic."""
	if not sub_topic_id or not course_id or not module_id or not topic_id:
		return JsonResponse({"error": "Missing course_id, module_id, topic_id or sub_topic_id"}, status=400)
	sub_topic = SubTopic.objects.filter(id=sub_topic_id).first()
	if not sub_topic:
		return JsonResponse({"error": "Sub Topic not found"}, status=404)

	sub_topic_data = {
		"id": sub_topic.id,
		"name": sub_topic.name,
		"description": sub_topic.description,
		"resource_url": sub_topic.resource_url,
		"created_at": sub_topic.created_at.isoformat(),
		"updated_at": sub_topic.updated_at.isoformat(),
		"module_id": sub_topic.topic.id
	}

	return JsonResponse({"success": True, "sub_topic": sub_topic_data}, status=200)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_subTopic_view(request, course_id, module_id, topic_id, sub_topic_id):
	"""Update an existing topic."""
	if not sub_topic_id or not course_id or not module_id or not topic_id:
		return JsonResponse({"error": "Missing sub_topic_id, course_id, module_id or topic_id"}, status=400)

	data = json.loads(request.body)
	valid_fields = ["name", "description", "resource_url"]
	invalid_fields = [field for field in data if field not in valid_fields]
	if invalid_fields:
		return JsonResponse({"error": f"Missing required fields: {', '.join(invalid_fields)}"}, status=400)

	sub_topic = SubTopic.objects.filter(id=sub_topic_id).first()
	if not sub_topic:
		return JsonResponse({"error": "Sub Topic not found"}, status=404)
	
	name = data.get("name", sub_topic.name)
	description = data.get("description", sub_topic.description)
	resource_url = data.get("resource_url", sub_topic.resource_url)

	sub_topic.name = name
	sub_topic.description = description
	sub_topic.resource_url = resource_url
	sub_topic.save()

	return JsonResponse({"status": "success", "message": "Sub topic updated successfully", "sub_topic":{
		"id": sub_topic.id,
		"name": sub_topic.name,
		"description": sub_topic.description,
		"resource_url": sub_topic.resource_url,
		"created_at": sub_topic.created_at.isoformat(),
		"updated_at": sub_topic.updated_at.isoformat(),
		"topic_id": sub_topic.topic.id
	}}, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_subTopic_view(request, course_id, module_id, topic_id, sub_topic_id):
	"""Delete a specific topic."""
	if not sub_topic_id or not course_id or not module_id or not topic_id:
		return JsonResponse({"error": "Missing sub_topic_id, course_id, module_id or topic_id"}, status=400)
	sub_topic = SubTopic.objects.filter(id=sub_topic_id).first()
	if not sub_topic:
		return JsonResponse({"error": "Sub Topic not found"}, status=404)
	sub_topic.delete()

	return JsonResponse({"status": "success", "message": "Sub Topic deleted successfully"}, status=204)