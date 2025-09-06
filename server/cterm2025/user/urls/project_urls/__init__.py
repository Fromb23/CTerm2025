
from django.urls import path, include
from .project_urls import urlpatterns as project_patterns

urlpatterns = [
    path("", include((project_patterns, "projects"))),
]