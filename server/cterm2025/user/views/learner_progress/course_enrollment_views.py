import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.db import transaction
from user.models import Course, CustomUser, CourseEnrollment
from django.utils import timezone

@csrf_exempt
@require_http_methods(["POST"])
@transaction.atomic
def create_enrollment_view(request):
    """Enroll a user into a course (self or admin)."""
    try:
        data = json.loads(request.body.decode("utf-8"))
        user_id = data.get("user_id")
        course_id = data.get("course_id")
        enrolled_by = data.get("enrolled_by", "self")

        if not user_id or not course_id:
            return JsonResponse(
                {"error": "user_id and course_id are required"},
                status=400
            )

        user = get_object_or_404(CustomUser, id=user_id)
        course = get_object_or_404(Course, id=course_id)

        if CourseEnrollment.objects.filter(user=user).exists():
            return JsonResponse({"error": "User is already enrolled in another course"}, status=400)

        # 🔹 Decide enrollment status
        if enrolled_by == "admin":
            status = "active"
        else:
            if hasattr(course, "start_date") and course.start_date > timezone.now():
                status = "pending"
            else:
                status = "active"

        enrollment, created = CourseEnrollment.objects.get_or_create(
            user=user,
            course=course,
            defaults={
                "status": status,
                "enrolled_on": timezone.now()
            }
        )

        if not created:
            # 🔹 Conflict: handle differently for admin vs self
            if enrolled_by == "admin":
                # Admin overrides existing enrollment
                enrollment.status = "active"
                enrollment.is_active = True
                enrollment.save()
                return JsonResponse(
                    {
                        "status": "success",
                        "message": "Admin re-activated enrollment",
                        "enrollment_id": str(enrollment.id),
                        "enrolled_status": enrollment.status
                    },
                    status=200
                )
            else:
                return JsonResponse(
                    {"error": "User already enrolled in this course"},
                    status=400
                )

        return JsonResponse(
            {
                "status": "success",
                "enrollment_id": str(enrollment.id),
                "enrolled_status": status
            },
            status=201
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def list_enrollments_view(request):
    """List enrollments, filter by user_id or course_id via query params."""
    user_id = request.GET.get("user_id")
    course_id = request.GET.get("course_id")

    enrollments = CourseEnrollment.objects.select_related("user", "course").all()
    
    if user_id:
        enrollments = enrollments.filter(user_id=user_id)
    if course_id:
        enrollments = enrollments.filter(course_id=course_id)

    data = [
        {
            "id": str(e.id),
            "user": {
                "id": str(e.user.id),
                "username": e.user.username,
                "email": e.user.email,
            },
            "course": {
                "id": str(e.course.id),
                "title": e.course.title,
            },
            "enrolled_on": e.enrolled_on.isoformat(),
            "completed_on": e.completed_on.isoformat() if e.completed_on else None,
            "status": e.status,
            "completion_percentage": e.completion_percentage,
        }
        for e in enrollments
    ]

    return JsonResponse({"enrollments": data}, status=200)



@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
@transaction.atomic
def update_enrollment_view(request, enrollment_id):
    """Update enrollment status, completion date, or progress."""
    enrollment = get_object_or_404(CourseEnrollment, id=enrollment_id)

    try:
        data = json.loads(request.body.decode("utf-8"))

        status = data.get("status")
        completed_on = data.get("completed_on")
        completion_percentage = data.get("completion_percentage")

        # --- Handle status update ---
        if status:
            valid_statuses = dict(CourseEnrollment.STATUS_CHOICES).keys()
            if status not in valid_statuses:
                return JsonResponse({"error": f"Invalid status: {status}"}, status=400)

            # Prevent weird transitions (example rule: can't complete a withdrawn course)
            if enrollment.status == "withdrawn" and status == "completed":
                return JsonResponse({"error": "Cannot mark a withdrawn enrollment as completed"}, status=400)

            enrollment.status = status

            # Auto-set completed_on if status = completed
            if status == "completed" and not enrollment.completed_on:
                enrollment.completed_on = timezone.now()

            # Optionally clear completed_on if reverting
            if status != "completed":
                enrollment.completed_on = None

        # --- Handle explicit completed_on update ---
        if completed_on:
            from django.utils.dateparse import parse_datetime
            parsed_date = parse_datetime(completed_on)
            if not parsed_date:
                return JsonResponse({"error": "Invalid datetime format for completed_on"}, status=400)
            enrollment.completed_on = parsed_date
            enrollment.status = "completed"  # sync status if completed_on is set

        # --- Handle progress update ---
        if completion_percentage is not None:
            try:
                progress = float(completion_percentage)
                if progress < 0 or progress > 100:
                    return JsonResponse({"error": "completion_percentage must be between 0 and 100"}, status=400)
                enrollment.completion_percentage = progress
                # Auto-mark completed if progress = 100
                if progress == 100:
                    enrollment.status = "completed"
                    if not enrollment.completed_on:
                        enrollment.completed_on = timezone.now()
            except ValueError:
                return JsonResponse({"error": "completion_percentage must be a number"}, status=400)

        enrollment.save()

        return JsonResponse({
            "status": "success",
            "enrollment_id": str(enrollment.id),
            "updated_status": enrollment.status,
            "completion_percentage": enrollment.completion_percentage,
            "completed_on": enrollment.completed_on.isoformat() if enrollment.completed_on else None,
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
@transaction.atomic
def delete_enrollment_view(request, enrollment_id):
    """Withdraw user from course without losing history (soft delete)."""
    enrollment = get_object_or_404(CourseEnrollment, id=enrollment_id)

    # Mark as withdrawn instead of deleting
    enrollment.status = "withdrawn"
    enrollment.is_active = False
    enrollment.save()

    return JsonResponse({
        "status": "success",
        "message": "Enrollment withdrawn (soft delete)",
        "enrollment_id": str(enrollment.id),
        "final_status": enrollment.status
    }, status=200)

