from django.urls import path
from user.views.user_views.admin_views import (
    create_admin_view,
    list_admins_view,
	list_admin_view,
    update_admin_view,
    delete_admin_view
)

urlpatterns = [
    path("", create_admin_view, name="create_admin"),
    path("list/", list_admins_view, name="list_admins"),
    path("<int:admin_id>/", list_admin_view, name="list_admin"),
    path("<int:admin_id>/update/", update_admin_view, name="update_admin"),
    path("<int:admin_id>/delete/", delete_admin_view, name="delete_admin"),
]