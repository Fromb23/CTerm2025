import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.db import transaction
from server.cterm2025.user.models import Module
from server.cterm2025.user.models.course_enrollment import CourseEnrollment, ModuleProgress

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_module_progress_view(request):
    """Create a ModuleProgress entry when a learner starts a module."""
    try:
        data = json.loads(request.body.decode("utf-8"))
        enrollment_id = data.get("enrollment_id")
        module_id = data.get("module_id")

        if not enrollment_id or not module_id:
            return JsonResponse({"error": "enrollment_id and module_id are required"}, status=400)

        enrollment = get_object_or_404(CourseEnrollment, id=enrollment_id)
        module = get_object_or_404(Module, id=module_id)

        progress, created = ModuleProgress.objects.get_or_create(
            enrollment=enrollment,
            module=module,
            defaults={"status": "not_started", "completion_percentage": 0.0}
        )

        if not created:
            return JsonResponse({"error": "Progress for this module already exists"}, status=400)

        return JsonResponse({
            "status": "success",
            "progress_id": str(progress.id),
            "module_status": progress.status
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def list_module_progress_view(request):
    """List module progress, filter by enrollment_id or module_id via query params."""
    enrollment_id = request.GET.get("enrollment_id")
    module_id = request.GET.get("module_id")

    progresses = ModuleProgress.objects.all()
    if enrollment_id:
        progresses = progresses.filter(enrollment_id=enrollment_id)
    if module_id:
        progresses = progresses.filter(module_id=module_id)

    data = [
        {
            "id": str(p.id),
            "enrollment_id": str(p.enrollment.id),
            "module_id": str(p.module.id),
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
def update_module_progress_view(request, progress_id):
    """Update status, completion, or timestamps of a module progress."""
    progress = get_object_or_404(ModuleProgress, id=progress_id)

    try:
        data = json.loads(request.body.decode("utf-8"))

        status = data.get("status")
        if status:
            if status not in dict(ModuleProgress.STATUS_CHOICES):
                return JsonResponse({"error": f"Invalid status: {status}"}, status=400)
            progress.status = status
            if status == "in_progress" and not progress.started_on:
                progress.started_on = timezone.now()
            if status == "completed":
                progress.completed_on = timezone.now()
                progress.completion_percentage = 100.0

        completion_percentage = data.get("completion_percentage")
        if completion_percentage is not None:
            try:
                completion_percentage = float(completion_percentage)
                if not (0.0 <= completion_percentage <= 100.0):
                    raise ValueError
                progress.completion_percentage = completion_percentage
            except ValueError:
                return JsonResponse({"error": "completion_percentage must be a float between 0 and 100"}, status=400)

        progress.save()
        return JsonResponse({"status": "success"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_module_progress_view(request, progress_id):
    """Delete (withdraw tracking of) a module progress."""
    progress = get_object_or_404(ModuleProgress, id=progress_id)
    progress.delete()
    return JsonResponse({"status": "success", "message": "Module progress deleted"}, status=200)
