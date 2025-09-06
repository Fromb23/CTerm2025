from django.urls import path, include
from .course_urls import urlpatterns as course_patterns

urlpatterns = [
    path("", include((course_patterns, "courses"))),
]