# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from user.views.course_views.course_views import CourseViewSet
from user.views.course_views.sprint_views import SprintViewSet
from user.views.course_views.module_views import ModuleViewSet
from user.views.course_views.topic_views import TopicViewSet
from user.views.course_views.subTopic_views import SubTopicViewSet
from user.views.course_views.task_views import TaskViewSet

# Main router for top-level resources
router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'tasks', TaskViewSet, basename='task')

# Nested routers for hierarchical resources
# Course nested resources (sprints and modules are direct children of course)
courses_router = routers.NestedDefaultRouter(router, r'courses', lookup='course')
courses_router.register(r'sprints', SprintViewSet, basename='course-sprints')
courses_router.register(r'modules', ModuleViewSet, basename='course-modules')

# Module nested resources (topics are children of modules)
modules_router = routers.NestedDefaultRouter(courses_router, r'modules', lookup='module')
modules_router.register(r'topics', TopicViewSet, basename='course-module-topics')

# Topic nested resources (subtopics are children of topics)
topics_router = routers.NestedDefaultRouter(modules_router, r'topics', lookup='topic')
topics_router.register(r'subtopics', SubTopicViewSet, basename='course-module-topic-subtopics')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(courses_router.urls)),
    path('', include(modules_router.urls)),
    path('', include(topics_router.urls)),
]

# This will automatically generate the following URLs:

# COURSES
# GET    /courses/                           -> list all courses
# POST   /courses/                           -> create course
# GET    /courses/{course_id}/               -> retrieve specific course
# PATCH  /courses/{course_id}/               -> update course
# DELETE /courses/{course_id}/               -> delete course

# SPRINTS (nested under courses)
# GET    /courses/{course_id}/sprints/       -> list sprints for course
# POST   /courses/{course_id}/sprints/       -> create sprint for course
# GET    /courses/{course_id}/sprints/{sprint_id}/    -> retrieve specific sprint
# PATCH  /courses/{course_id}/sprints/{sprint_id}/    -> update sprint
# DELETE /courses/{course_id}/sprints/{sprint_id}/    -> delete sprint

# MODULES (nested under courses)
# GET    /courses/{course_id}/modules/       -> list modules for course
# POST   /courses/{course_id}/modules/       -> create module for course
# GET    /courses/{course_id}/modules/{module_id}/    -> retrieve specific module
# PATCH  /courses/{course_id}/modules/{module_id}/    -> update module
# DELETE /courses/{course_id}/modules/{module_id}/    -> delete module

# TOPICS (nested under course modules)
# GET    /courses/{course_id}/modules/{module_id}/topics/     -> list topics for module
# POST   /courses/{course_id}/modules/{module_id}/topics/     -> create topic for module
# GET    /courses/{course_id}/modules/{module_id}/topics/{topic_id}/   -> retrieve specific topic
# PATCH  /courses/{course_id}/modules/{module_id}/topics/{topic_id}/   -> update topic
# DELETE /courses/{course_id}/modules/{module_id}/topics/{topic_id}/   -> delete topic

# SUBTOPICS (nested under topics)
# GET    /courses/{course_id}/modules/{module_id}/topics/{topic_id}/subtopics/     -> list subtopics
# POST   /courses/{course_id}/modules/{module_id}/topics/{topic_id}/subtopics/     -> create subtopic
# GET    /courses/{course_id}/modules/{module_id}/topics/{topic_id}/subtopics/{subtopic_id}/   -> retrieve subtopic
# PATCH  /courses/{course_id}/modules/{module_id}/topics/{topic_id}/subtopics/{subtopic_id}/   -> update subtopic
# DELETE /courses/{course_id}/modules/{module_id}/topics/{topic_id}/subtopics/{subtopic_id}/   -> delete subtopic

# TASKS (independent resource)
# GET    /tasks/                             -> list all tasks
# POST   /tasks/                             -> create task
# GET    /tasks/{task_id}/                   -> retrieve specific task
# PATCH  /tasks/{task_id}/                   -> update task
# DELETE /tasks/{task_id}/                   -> delete task