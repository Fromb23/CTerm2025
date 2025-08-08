from django.urls import path, include

from .role_urls import urlpatterns as role_patterns
from .student_urls import urlpatterns as student_patterns
from .admin_urls import urlpatterns as admin_patterns

urlpatterns = [
    path("roles/", include((role_patterns, "roles"))),
    path("students/", include((student_patterns, "students"))),
    path("admins/", include((admin_patterns, "admins"))),
]
