from django.urls import path, include

urlpatterns = [
    path("", include("user.urls.auth.auth_urls")),
]