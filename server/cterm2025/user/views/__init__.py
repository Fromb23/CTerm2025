from .role_views import (
    create_role_view,
    list_roles_view,
    update_role_view,
    delete_role_view
)

from .student_views import (
    create_student_view,
    list_students_view,
    update_student_view,
    delete_student_view
)

from .admin_views import (
    create_admin_view,
    list_admins_view,
    update_admin_view,
    delete_admin_view
)

__all__ = [
    # Role views
    "create_role_view", "list_roles_view", "update_role_view", "delete_role_view",

    # Student views
    "create_student_view", "list_students_view", "update_student_view", "delete_student_view",

    # Admin views
    "create_admin_view", "list_admins_view", "update_admin_view", "delete_admin_view",
]
