from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user.views.course_enrollment_views import (
    CourseEnrollmentViewSet,
    SprintProgressViewSet,
    ModuleProgressViewSet,
    TopicProgressViewSet,
    SubTopicProgressViewSet,
    TaskProgressViewSet,
    ProjectProgressViewSet,
    LearnerDashboardView,
    CourseProgressSummaryView,
    InstructorDashboardView,
    ProgressAnalyticsView,
    BulkProgressUpdateView,
    EnrollmentStatsView,
    LearnerProfileView,
    CourseCompletionView,
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'', CourseEnrollmentViewSet, basename='courseenrollment')
router.register(r'sprint-progress', SprintProgressViewSet, basename='sprintprogress')
router.register(r'module-progress', ModuleProgressViewSet, basename='moduleprogress')
router.register(r'topic-progress', TopicProgressViewSet, basename='topicprogress')
router.register(r'subtopic-progress', SubTopicProgressViewSet, basename='subtopicprogress')
router.register(r'task-progress', TaskProgressViewSet, basename='taskprogress')
router.register(r'project-progress', ProjectProgressViewSet, basename='projectprogress')

# Define URL patterns
urlpatterns = [
    # Include router URLs (no api/v1/ prefix here)
    path('', include(router.urls)),
    
    # Dashboard and Analytics URLs
    path('dashboard/learner/', LearnerDashboardView.as_view(), name='learner-dashboard'),
    path('dashboard/instructor/', InstructorDashboardView.as_view(), name='instructor-dashboard'),
    path('analytics/progress/', ProgressAnalyticsView.as_view(), name='progress-analytics'),
    path('stats/enrollment/', EnrollmentStatsView.as_view(), name='enrollment-stats'),
    
    # Learner-specific URLs
    path('learner/profile/', LearnerProfileView.as_view(), name='learner-profile'),
    path('enrollment/<uuid:enrollment_id>/summary/', 
         CourseProgressSummaryView.as_view(), name='course-progress-summary'),
    path('enrollment/<uuid:enrollment_id>/complete/', 
         CourseCompletionView.as_view(), name='course-completion'),
    
    # Administrative URLs
    path('admin/bulk-update/', BulkProgressUpdateView.as_view(), name='bulk-progress-update'),
    
    # Enrollment Management URLs
    path('enrollments/<uuid:pk>/pause/', 
         CourseEnrollmentViewSet.as_view({'post': 'pause_enrollment'}), name='pause-enrollment'),
    path('enrollments/<uuid:pk>/resume/', 
         CourseEnrollmentViewSet.as_view({'post': 'resume_enrollment'}), name='resume-enrollment'),
    path('enrollments/<uuid:pk>/withdraw/', 
         CourseEnrollmentViewSet.as_view({'post': 'withdraw'}), name='withdraw-enrollment'),
    path('<uuid:pk>/overview/', 
         CourseEnrollmentViewSet.as_view({'get': 'progress_overview'}), name='enrollment-overview'),
    
    # Sprint Progress URLs
    path('sprint-progress/<uuid:pk>/start/', 
         SprintProgressViewSet.as_view({'post': 'start_sprint'}), name='start-sprint'),
    path('sprint-progress/<uuid:pk>/complete/', 
         SprintProgressViewSet.as_view({'post': 'complete_sprint'}), name='complete-sprint'),
    
    # Module Progress URLs
    path('module-progress/<uuid:pk>/update-progress/', 
         ModuleProgressViewSet.as_view({'post': 'update_progress'}), name='update-module-progress'),
    path('module-progress/<uuid:pk>/topic-breakdown/', 
         ModuleProgressViewSet.as_view({'get': 'topic_breakdown'}), name='module-topic-breakdown'),
    
    # Topic Progress URLs
    path('topic-progress/<uuid:pk>/complete/', 
         TopicProgressViewSet.as_view({'post': 'complete_topic'}), name='complete-topic'),
    
    # SubTopic Progress URLs
    path('subtopic-progress/<uuid:pk>/task-summary/', 
         SubTopicProgressViewSet.as_view({'get': 'task_summary'}), name='subtopic-task-summary'),
    
    # Task Progress URLs
    path('task-progress/<uuid:pk>/submit/', 
         TaskProgressViewSet.as_view({'post': 'submit_task'}), name='submit-task'),
    
    # Project Progress URLs
    path('project-progress/<uuid:pk>/update-milestone/', 
         ProjectProgressViewSet.as_view({'post': 'update_milestone'}), name='update-project-milestone'),
    path('project-progress/<uuid:pk>/hold/', 
         ProjectProgressViewSet.as_view({'post': 'put_on_hold'}), name='hold-project'),
]

# URL pattern names for easy reference
app_name = 'enrollment_tracker'