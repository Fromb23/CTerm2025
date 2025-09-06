from django.urls import path
from user.views.course_views.project_views import (
	create_project_view,
	list_projects_view,
	list_project_view,
	update_project_view,
	delete_project_view,
)
urlpatterns = [
	path("", create_project_view, name="create_project"),
	path("list/", list_projects_view, name="list_projects"),
	path("<int:project_id>/", list_project_view, name="list_project"),
	path("<int:project_id>/update/", update_project_view, name="update_project"),
	path("<int:project_id>/delete/", delete_project_view, name="delete_project"),
]