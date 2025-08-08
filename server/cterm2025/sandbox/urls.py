from django.urls import path
from .views import ValidateRepo

urlpatterns = [
    path('validate/', ValidateRepo.as_view(), name='validate-task'),
]