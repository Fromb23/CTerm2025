from django.urls import path
from user.views.student_views import (
    create_student_view,
    update_student_view,
    delete_student_view
)

urlpatterns = [
    path("create/", create_student_view, name="create_student"),
    path("update/<uuid:student_id>/", update_student_view, name="update_student"),
    path("delete/<uuid:student_id>/", delete_student_view, name="delete_student"),
]
