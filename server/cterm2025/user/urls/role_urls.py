from django.urls import path
from user.views.role_views import create_role_view, list_roles_view, update_role_view, delete_role_view

urlpatterns = [
    path("create/", create_role_view, name="create_role"),
    path("list/", list_roles_view, name="list_roles"),
    path("update/<uuid:role_id>/", update_role_view, name="update_role"),
    path("delete/<uuid:role_id>/", delete_role_view, name="delete_role"),
]
