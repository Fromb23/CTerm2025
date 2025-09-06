from .user_views.role_views import (
    create_role_view,
    list_roles_view,
    update_role_view,
    delete_role_view
)

from .user_views.student_views import (
    create_student_view,
    update_student_view,
    delete_student_view
)

from .user_views.admin_views import (
    create_admin_view,
    list_admins_view,
    update_admin_view,
    delete_admin_view
)

from .learner_progress.course_enrollment_views import (
    create_enrollment_view,
    list_enrollments_view,
    update_enrollment_view,
    delete_enrollment_view
)

from .learner_progress.topic_progress_views import (
    create_topic_progress_view,
    list_topic_progress_view,
    get_topic_progress_view,
    update_topic_progress_view,
    delete_topic_progress_view
)

__all__ = [
    # Role views
    "create_role_view", "list_roles_view", "update_role_view", "delete_role_view",

    # Student views
    "create_student_view", "list_students_view", "update_student_view", "delete_student_view",

    # Admin views
    "create_admin_view", "list_admins_view", "update_admin_view", "delete_admin_view",
	
    # Course enrollment views
    "create_enrollment_view", "list_enrollments_view", "update_enrollment_view", "delete_enrollment_view",

    # Topic progress views
    "create_topic_progress_view", "list_topic_progress_view", "get_topic_progress_view", "update_topic_progress_view", "delete_topic_progress_view"
]
