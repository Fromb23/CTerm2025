from django.urls import path
from user.views.admin_views import (
    create_admin_view,
    list_admins_view,
    update_admin_view,
    delete_admin_view
)

urlpatterns = [
    path("create/", create_admin_view, name="create_admin"),
    path("list/", list_admins_view, name="list_admins"),
    path("update/<uuid:admin_id>/", update_admin_view, name="update_admin"),
    path("delete/<uuid:admin_id>/", delete_admin_view, name="delete_admin"),
]