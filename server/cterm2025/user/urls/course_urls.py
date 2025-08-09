# urls/course_urls.py
from django.urls import path
from views.course_views import (
    create_course_view,
    list_courses_view,
    get_course_view,
    update_course_view,
    delete_course_view,
)
from views.module_views import (
    create_module_view,
    list_modules_view,
    get_module_view,
    update_module_view,
    delete_module_view,
)
from views.content_views import (
    create_content_view,
    list_content_view,
    get_content_view,
    update_content_view,
    delete_content_view,
)
from views.topic_views import (
    create_topic_view,
    list_topics_view,
    get_topic_view,
    update_topic_view,
    delete_topic_view,
)
from views.task_views import (
    create_task_view,
    list_tasks_view,
    get_task_view,
    update_task_view,
    delete_task_view,
)

urlpatterns = [
    # Courses
    path("", list_courses_view, name="list_courses"),
    path("create/", create_course_view, name="create_course"),
    path("<int:course_id>/", get_course_view, name="get_course"),
    path("<int:course_id>/update/", update_course_view, name="update_course"),
    path("<int:course_id>/delete/", delete_course_view, name="delete_course"),

    # Modules
    path("<int:course_id>/modules/", list_modules_view, name="list_modules"),
    path("modules/create/", create_module_view, name="create_module"),
    path("modules/<int:module_id>/", get_module_view, name="get_module"),
    path("modules/<int:module_id>/update/", update_module_view, name="update_module"),
    path("modules/<int:module_id>/delete/", delete_module_view, name="delete_module"),

    # Content
    path("modules/<int:module_id>/content/", list_content_view, name="list_content"),
    path("content/create/", create_content_view, name="create_content"),
    path("content/<int:content_id>/", get_content_view, name="get_content"),
    path("content/<int:content_id>/update/", update_content_view, name="update_content"),
    path("content/<int:content_id>/delete/", delete_content_view, name="delete_content"),

    # Topics
    path("modules/<int:module_id>/topics/", list_topics_view, name="list_topics"),
    path("topics/create/", create_topic_view, name="create_topic"),
    path("topics/<int:topic_id>/", get_topic_view, name="get_topic"),
    path("topics/<int:topic_id>/update/", update_topic_view, name="update_topic"),
    path("topics/<int:topic_id>/delete/", delete_topic_view, name="delete_topic"),

    # Tasks
    path("topics/<int:topic_id>/tasks/", list_tasks_view, name="list_tasks"),
    path("tasks/create/", create_task_view, name="create_task"),
    path("tasks/<int:task_id>/", get_task_view, name="get_task"),
    path("tasks/<int:task_id>/update/", update_task_view, name="update_task"),
    path("tasks/<int:task_id>/delete/", delete_task_view, name="delete_task"),
]
