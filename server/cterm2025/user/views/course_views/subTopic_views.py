from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from user.models.course_model import SubTopic,Topic


@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_subTopic_view(request):
	"""Create a new sub topic for a given topic."""
	name = request.POST.get("name")
	description = request.POST.get("description", "")
	resource_url = request.POST.get("resource_url", "")
	topic_id = request.POST.get("topic_id")

	if not name or not topic_id:
		return JsonResponse({"error": "Missing required fields"}, status=400)

	module = get_object_or_404(Topic, id=topic_id)

	sub_topic = SubTopic.objects.create(
		sub_topic=sub_topic,
		name=name,
		description=description,
		resource_url=resource_url,
		created_at=request.POST.get("created_at", None),
		updated_at=request.POST.get("updated_at", None)
	)

	return JsonResponse({"status": "success", "sub topic_id": sub_topic.id}, status=201)


@csrf_exempt
@require_http_methods(["GET"])
def list_subTopics_view(request, subtopic_id):
	"""List all sub topics of a given topic."""
	sub_topic = get_object_or_404(SubTopic, id=subtopic_id)
	sub_topics = sub_topic.sub_topic.all().order_by("id")

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

@csrf_exempt
@require_http_methods(["GET"])
def get_subTopic_view(request, sub_topic_id):
	"""Get details of a specific topic."""
	sub_topic = get_object_or_404(SubTopic, id=sub_topic_id)

	sub_topic_data = {
		"id": sub_topic.id,
		"name": sub_topic.name,
		"description": sub_topic.description,
		"resource_url": sub_topic.resource_url,
		"created_at": sub_topic.created_at.isoformat(),
		"updated_at": sub_topic.updated_at.isoformat(),
		"module_id": sub_topic.topic.id
	}

	return JsonResponse({"topic": sub_topic_data}, status=200)

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def update_subTopic_view(request, sub_topic_id):
	"""Update an existing topic."""
	sub_topic = get_object_or_404(SubTopic, id=sub_topic_id)

	name = request.POST.get("name", sub_topic.name)
	description = request.POST.get("description", sub_topic.description)
	resource_url = request.POST.get("resource_url", sub_topic.resource_url)

	sub_topic.name = name
	sub_topic.description = description
	sub_topic.resource_url = resource_url
	sub_topic.save()

	return JsonResponse({"status": "success", "message": "Sub topic updated successfully", "topic_id": sub_topic.id}, status=200)

@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_subTopic_view(request, sub_topic_id):
	"""Delete a specific topic."""
	sub_topic = get_object_or_404(SubTopic, id=sub_topic_id)
	sub_topic.delete()

	return JsonResponse({"status": "success", "message": "Sub Topic deleted successfully"}, status=204)