from django.urls import path
from server.cterm2025.user.views.learner_progress.course_enrollment_views import (
    create_enrollment_view,
    list_enrollments_view,
    update_enrollment_view,
    delete_enrollment_view,
)

urlpatterns = [
    path("", list_enrollments_view, name="list_enrollments"),
    path("create/", create_enrollment_view, name="create_enrollment"),
    path("<int:enrollment_id>/update/", update_enrollment_view, name="update_enrollment"),
    path("<int:enrollment_id>/delete/", delete_enrollment_view, name="delete_enrollment"),
]
