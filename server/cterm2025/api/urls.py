from django.urls import path
from . import views

urlpatterns = [
    path("status/", views.api_status, name="api-status"),
    path("logs/", views.fetch_logs, name="fetch-logs"),
    # any other global API utilities
]
