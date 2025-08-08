from django.urls import path, include

from .role_urls import urlpatterns as role_patterns
from .student_urls import urlpatterns as student_patterns
from .admin_urls import urlpatterns as admin_patterns

urlpatterns = [
    path("roles/", include((role_patterns, "roles"))),
    path("students/", include((student_patterns, "students"))),
    path("admins/", include((admin_patterns, "admins"))),
]

from .error_handlers import (
    custom_bad_request,
    custom_permission_denied,
    custom_page_not_found,
    custom_server_error,
)

handler400 = custom_bad_request
handler403 = custom_permission_denied
handler404 = custom_page_not_found
handler500 = custom_server_error