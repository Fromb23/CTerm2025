from django.urls import path
from user.views.user_views.student_views import (
    create_student_view,
    update_student_view,
    delete_student_view
)

urlpatterns = [
    path("create/", create_student_view, name="create_student"),
    path("update/<int:student_id>/", update_student_view, name="update_student"),
    path("delete/<int:student_id>/", delete_student_view, name="delete_student"),
]
