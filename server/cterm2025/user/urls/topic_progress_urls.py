# urls/topic_progress_urls.py
from django.urls import path
from server.cterm2025.user.views.learner_progress.topic_progress_views import (
    create_topic_progress_view,
    list_topic_progress_view,
    get_topic_progress_view,
    update_topic_progress_view,
    delete_topic_progress_view,
)

urlpatterns = [
    path("", list_topic_progress_view, name="list_topic_progress"),
    path("create/", create_topic_progress_view, name="create_topic_progress"),
    path("<int:progress_id>/", get_topic_progress_view, name="get_topic_progress"),
    path("<int:progress_id>/update/", update_topic_progress_view, name="update_topic_progress"),
    path("<int:progress_id>/delete/", delete_topic_progress_view, name="delete_topic_progress"),
]