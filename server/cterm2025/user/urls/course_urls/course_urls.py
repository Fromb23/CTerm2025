from django.urls import path
from user.views.course_views.course_views import (
    create_course_view,
    list_courses_view,
    list_course_view,
    update_course_view,
    delete_course_view,
)

from user.views.course_views.sprint_views import (
    create_sprint_view,
    list_sprints_view,
    list_sprint_view,
    update_sprint_view,
    delete_sprint_view
)

from user.views.course_views.module_views import (
    create_module_view,
    list_modules_view,
    list_module_view,
    update_module_view,
    delete_module_view,
)
from user.views.course_views.topic_views import (
    create_topic_view,
    list_topics_view,
    list_topic_view,
    update_topic_view,
    delete_topic_view,
)

from user.views.course_views.subTopic_views import (
    create_subTopic_view,
    update_subTopic_view,
    list_subTopics_view,
    list_subTopic_view,
    delete_subTopic_view,
)

from user.views.course_views.task_views import (
    create_task_view,
    list_tasks_view,
    list_task_view,
    update_task_view,
    delete_task_view,
)

urlpatterns = [
    # Courses
    path("list/", list_courses_view, name="list_courses"),
    path("", create_course_view, name="create_course"),
    path("<int:course_id>/", list_course_view, name="get_course"),
    path("<int:course_id>/update/", update_course_view, name="update_course"),
    path("<int:course_id>/delete/", delete_course_view, name="delete_course"),

    # Sprints (nested under courses)
    path("<int:course_id>/sprints/list/", list_sprints_view, name="list_sprints"),
    path("<int:course_id>/sprints/", create_sprint_view, name="create_sprint"),
    path("<int:course_id>/sprints/<int:sprint_id>/", list_sprint_view, name="get_sprint"),
    path("<int:course_id>/sprints/<int:sprint_id>/update/", update_sprint_view, name="update_sprint"),
    path("<int:course_id>/sprints/<int:sprint_id>/delete/", delete_sprint_view, name="delete_sprint"),

    # Modules
    path("<int:course_id>/modules/list/", list_modules_view, name="list_modules"),
    path("<int:course_id>/modules/", create_module_view, name="create_module"),
    path("<int:course_id>/modules/<int:module_id>/", list_module_view, name="get_module"),
    path("<int:course_id>/modules/<int:module_id>/update/", update_module_view, name="update_module"),
    path("<int:course_id>/modules/<int:module_id>/delete/", delete_module_view, name="delete_module"),

    # Topics
    path("<int:course_id>/modules/<int:module_id>/topics/list/", list_topics_view, name="list_topics"),
    path("<int:course_id>/modules/<int:module_id>/topics/<int:topic_id>/", list_topic_view, name="get_topic"),
    path("<int:course_id>/modules/<int:module_id>/topics/", create_topic_view, name="create_topic"),
    path("<int:course_id>/modules/<int:module_id>/topics/<int:topic_id>/update/", update_topic_view, name="update_topic"),
    path("<int:course_id>/modules/<int:module_id>/topics/<int:topic_id>/delete/", delete_topic_view, name="delete_topic"),

    # SubTopics
    path("<int:course_id>/modules/<int:module_id>/topics/<int:topic_id>/subtopics/", create_subTopic_view, name="create_subTopic"),
    path("<int:course_id>/modules/<int:module_id>/topics/<int:topic_id>/subtopics/list/", list_subTopics_view, name="list_subtopics"),
    path("<int:course_id>/modules/<int:module_id>/topics/<int:topic_id>/subtopics/<int:sub_topic_id>/", list_subTopic_view, name="get_subtopics"),
    path("<int:course_id>/modules/<int:module_id>/topics/<int:topic_id>/subtopics/<int:sub_topic_id>/update/", update_subTopic_view, name="update_subTopic"),
    path("<int:course_id>/modules/<int:module_id>/topics/<int:topic_id>/subtopics/<int:sub_topic_id>/delete/", delete_subTopic_view, name="delete_subtopics"),

    # Tasks
    path("tasks/list/", list_tasks_view, name="list_tasks"),
    path("tasks/", create_task_view, name="create_task"),
    path("tasks/<int:task_id>/", list_task_view, name="get_task"),
    path("tasks/<int:task_id>/update/", update_task_view, name="update_task"),
    path("tasks/<int:task_id>/delete/", delete_task_view, name="delete_task"),
]