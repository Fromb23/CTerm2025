from django.urls import path, include

urlpatterns = [
    path("users/", include("user.urls.user_urls")),
    path("courses/", include("user.urls.course_urls")),
	path("auth/", include("user.urls.auth.auth_urls")),
	path("projects/", include("user.urls.project_urls")),
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