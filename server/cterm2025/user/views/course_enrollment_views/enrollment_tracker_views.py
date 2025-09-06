from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Q, Count, Avg, F, Case, When, Value, IntegerField
from django.utils import timezone
from datetime import datetime, timedelta

from user.models.course_enrollment import (
    CourseEnrollment, SprintProgress, ModuleProgress, 
    TopicProgress, SubTopicProgress, TaskProgress, ProjectProgress
)
from user.serializers.enrollement_tracker_serializers import (
    CourseEnrollmentSerializer, SprintProgressSerializer,
    ModuleProgressSerializer, TopicProgressSerializer,
    SubTopicProgressSerializer, TaskProgressSerializer,
    ProjectProgressSerializer, ProgressSummarySerializer
)


class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing course enrollments
    Handles enrollment creation, status updates, and progress tracking
    """
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return CourseEnrollment.objects.all()
        return CourseEnrollment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def pause_enrollment(self, request, pk=None):
        """Pause an active enrollment"""
        enrollment = self.get_object()
        if enrollment.status == 'active':
            enrollment.status = 'paused'
            enrollment.save()
            return Response({'status': 'enrollment paused'})
        return Response({'error': 'Can only pause active enrollments'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def resume_enrollment(self, request, pk=None):
        """Resume a paused enrollment"""
        enrollment = self.get_object()
        if enrollment.status == 'paused':
            enrollment.status = 'active'
            enrollment.save()
            return Response({'status': 'enrollment resumed'})
        return Response({'error': 'Can only resume paused enrollments'},
                       status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """Withdraw from course"""
        enrollment = self.get_object()
        enrollment.status = 'withdrawn'
        enrollment.is_active = False
        enrollment.save()
        return Response({'status': 'withdrawn from course'})

    @action(detail=True, methods=['get'])
    def progress_overview(self, request, pk=None):
        """Get comprehensive progress overview for an enrollment"""
        enrollment = self.get_object()
        
        # Calculate sprint progress
        sprint_stats = SprintProgress.objects.filter(enrollment=enrollment).aggregate(
            total_sprints=Count('id'),
            completed_sprints=Count('id', filter=Q(status='completed')),
            in_progress_sprints=Count('id', filter=Q(status='in_progress'))
        )
        
        # Calculate module progress
        module_stats = ModuleProgress.objects.filter(enrollment=enrollment).aggregate(
            total_modules=Count('id'),
            completed_modules=Count('id', filter=Q(status='completed')),
            avg_completion=Avg('completion_percentage')
        )
        
        # Calculate project progress
        project_stats = ProjectProgress.objects.filter(enrollment=enrollment).aggregate(
            total_projects=Count('id'),
            completed_projects=Count('id', filter=Q(status='completed')),
            avg_completion=Avg('completion_percentage')
        )

        return Response({
            'enrollment_id': enrollment.id,
            'overall_completion': enrollment.completion_percentage,
            'sprint_progress': sprint_stats,
            'module_progress': module_stats,
            'project_progress': project_stats,
            'last_activity': enrollment.updated_at,
            'enrollment_status': enrollment.status
        })


class SprintProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing sprint progress tracking
    """
    serializer_class = SprintProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return SprintProgress.objects.all()
        return SprintProgress.objects.filter(enrollment__user=self.request.user)

    @action(detail=True, methods=['post'])
    def start_sprint(self, request, pk=None):
        """Mark sprint as started"""
        progress = self.get_object()
        if progress.status == 'not_started':
            progress.status = 'in_progress'
            progress.started_on = timezone.now()
            progress.save()
            return Response({'status': 'sprint started'})
        return Response({'error': 'Sprint already started'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def complete_sprint(self, request, pk=None):
        """Mark sprint as completed"""
        progress = self.get_object()
        progress.status = 'completed'
        progress.completion_percentage = 100.0
        progress.completed_on = timezone.now()
        progress.save()
        
        # Update overall enrollment progress
        self._update_enrollment_progress(progress.enrollment)
        
        return Response({'status': 'sprint completed'})

    def _update_enrollment_progress(self, enrollment):
        """Update overall enrollment completion percentage"""
        sprint_progresses = SprintProgress.objects.filter(enrollment=enrollment)
        total_completion = sum(p.completion_percentage for p in sprint_progresses)
        avg_completion = total_completion / sprint_progresses.count() if sprint_progresses.count() > 0 else 0
        
        enrollment.completion_percentage = avg_completion
        if avg_completion >= 100.0:
            enrollment.status = 'completed'
            enrollment.completed_on = timezone.now()
        enrollment.save()


class ModuleProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing module progress tracking
    """
    serializer_class = ModuleProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ModuleProgress.objects.all()
        return ModuleProgress.objects.filter(enrollment__user=self.request.user)

    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Update module completion percentage"""
        progress = self.get_object()
        completion_pct = request.data.get('completion_percentage', 0)
        
        if 0 <= completion_pct <= 100:
            progress.completion_percentage = completion_pct
            
            if completion_pct > 0 and progress.status == 'not_started':
                progress.status = 'in_progress'
                progress.started_on = timezone.now()
            elif completion_pct >= 100:
                progress.status = 'completed'
                progress.completed_on = timezone.now()
                
            progress.save()
            return Response({'status': 'progress updated', 'completion': completion_pct})
        
        return Response({'error': 'Invalid completion percentage'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def topic_breakdown(self, request, pk=None):
        """Get topic-by-topic progress breakdown for this module"""
        progress = self.get_object()
        topic_progresses = TopicProgress.objects.filter(module_progress=progress)
        
        breakdown = []
        for tp in topic_progresses:
            subtopic_stats = SubTopicProgress.objects.filter(topic_progress=tp).aggregate(
                total=Count('id'),
                completed=Count('id', filter=Q(status='completed'))
            )
            
            breakdown.append({
                'topic_name': tp.topic.name,
                'status': tp.status,
                'subtopics_total': subtopic_stats['total'],
                'subtopics_completed': subtopic_stats['completed'],
                'completion_rate': (subtopic_stats['completed'] / subtopic_stats['total'] * 100) 
                                 if subtopic_stats['total'] > 0 else 0
            })
        
        return Response({'module': progress.module.name, 'topics': breakdown})


class TopicProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing topic progress tracking
    """
    serializer_class = TopicProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return TopicProgress.objects.all()
        return TopicProgress.objects.filter(module_progress__enrollment__user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete_topic(self, request, pk=None):
        """Mark topic as completed and update module progress"""
        topic_progress = self.get_object()
        topic_progress.status = 'completed'
        topic_progress.completed_on = timezone.now()
        topic_progress.save()
        
        # Check if all topics in module are completed
        module_progress = topic_progress.module_progress
        total_topics = TopicProgress.objects.filter(module_progress=module_progress).count()
        completed_topics = TopicProgress.objects.filter(
            module_progress=module_progress, 
            status='completed'
        ).count()
        
        completion_pct = (completed_topics / total_topics) * 100 if total_topics > 0 else 0
        module_progress.completion_percentage = completion_pct
        
        if completion_pct >= 100:
            module_progress.status = 'completed'
            module_progress.completed_on = timezone.now()
        elif completion_pct > 0:
            module_progress.status = 'in_progress'
            
        module_progress.save()
        
        return Response({
            'status': 'topic completed',
            'module_completion': completion_pct
        })


class SubTopicProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing subtopic progress tracking
    """
    serializer_class = SubTopicProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return SubTopicProgress.objects.all()
        return SubTopicProgress.objects.filter(
            topic_progress__module_progress__enrollment__user=self.request.user
        )

    @action(detail=True, methods=['get'])
    def task_summary(self, request, pk=None):
        """Get task completion summary for this subtopic"""
        subtopic_progress = self.get_object()
        task_progresses = TaskProgress.objects.filter(subtopic_progress=subtopic_progress)
        
        summary = {
            'total_tasks': task_progresses.count(),
            'completed_tasks': task_progresses.filter(status='completed').count(),
            'in_progress_tasks': task_progresses.filter(status='in_progress').count(),
            'average_score': task_progresses.aggregate(avg_score=Avg('score'))['avg_score'] or 0,
            'tasks': []
        }
        
        for task_progress in task_progresses:
            summary['tasks'].append({
                'task_name': task_progress.task.name,
                'task_type': task_progress.task_type,
                'status': task_progress.status,
                'score': task_progress.score,
                'percentage': task_progress.percentage,
                'completed_on': task_progress.completed_on
            })
            
        return Response(summary)


class TaskProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing individual task progress and scoring
    """
    serializer_class = TaskProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return TaskProgress.objects.all()
        return TaskProgress.objects.filter(
            subtopic_progress__topic_progress__module_progress__enrollment__user=self.request.user
        )

    @action(detail=True, methods=['post'])
    def submit_task(self, request, pk=None):
        """Submit task for grading/completion"""
        task_progress = self.get_object()
        score = request.data.get('score')
        max_score = request.data.get('max_score', 100)
        
        if task_progress.status == 'not_started':
            task_progress.started_on = timezone.now()
            
        task_progress.status = 'completed'
        task_progress.completed_on = timezone.now()
        
        if score is not None:
            task_progress.score = float(score)
            task_progress.max_score = float(max_score)
            
        task_progress.save()
        
        # Check if all tasks in subtopic are completed
        self._check_subtopic_completion(task_progress.subtopic_progress)
        
        return Response({
            'status': 'task submitted',
            'score': task_progress.score,
            'percentage': task_progress.percentage
        })

    def _check_subtopic_completion(self, subtopic_progress):
        """Check if subtopic should be marked as completed"""
        total_tasks = TaskProgress.objects.filter(subtopic_progress=subtopic_progress).count()
        completed_tasks = TaskProgress.objects.filter(
            subtopic_progress=subtopic_progress,
            status='completed'
        ).count()
        
        if total_tasks > 0 and completed_tasks == total_tasks:
            subtopic_progress.status = 'completed'
            subtopic_progress.completed_on = timezone.now()
            subtopic_progress.save()


class ProjectProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing project progress tracking
    """
    serializer_class = ProjectProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ProjectProgress.objects.all()
        return ProjectProgress.objects.filter(enrollment__user=self.request.user)

    @action(detail=True, methods=['post'])
    def update_milestone(self, request, pk=None):
        """Update project milestone completion"""
        project_progress = self.get_object()
        completion_pct = request.data.get('completion_percentage', 0)
        milestone = request.data.get('milestone', '')
        
        if 0 <= completion_pct <= 100:
            project_progress.completion_percentage = completion_pct
            
            if completion_pct > 0 and project_progress.status == 'not_started':
                project_progress.status = 'in_progress'
                project_progress.started_on = timezone.now()
            elif completion_pct >= 100:
                project_progress.status = 'completed'
                project_progress.completed_on = timezone.now()
                
            project_progress.save()
            
            return Response({
                'status': 'milestone updated',
                'completion': completion_pct,
                'milestone': milestone
            })
        
        return Response({'error': 'Invalid completion percentage'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def put_on_hold(self, request, pk=None):
        """Put project on hold"""
        project_progress = self.get_object()
        project_progress.status = 'on_hold'
        project_progress.save()
        return Response({'status': 'project put on hold'})


class LearnerDashboardView(APIView):
    """
    Main dashboard view for learners - shows overview of all enrollments and progress
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        enrollments = CourseEnrollment.objects.filter(user=user, is_active=True)
        
        dashboard_data = {
            'learner_info': {
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'total_enrollments': enrollments.count(),
                'active_enrollments': enrollments.filter(status='active').count(),
                'completed_courses': enrollments.filter(status='completed').count()
            },
            'current_courses': [],
            'recent_activity': [],
            'upcoming_deadlines': []
        }
        
        for enrollment in enrollments.filter(status__in=['active', 'pending']):
            course_data = {
                'course_name': enrollment.course.name,
                'enrollment_id': enrollment.id,
                'status': enrollment.status,
                'completion_percentage': enrollment.completion_percentage,
                'enrolled_on': enrollment.enrolled_on,
                'last_activity': enrollment.updated_at
            }
            dashboard_data['current_courses'].append(course_data)
        
        return Response(dashboard_data)


class CourseProgressSummaryView(APIView):
    """
    Detailed progress summary for a specific course enrollment
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, enrollment_id):
        enrollment = get_object_or_404(
            CourseEnrollment, 
            id=enrollment_id, 
            user=request.user
        )
        
        summary = {
            'course_info': {
                'name': enrollment.course.name,
                'enrollment_date': enrollment.enrolled_on,
                'status': enrollment.status,
                'overall_completion': enrollment.completion_percentage
            },
            'sprint_progress': [],
            'module_progress': [],
            'project_progress': []
        }
        
        # Get sprint progress
        sprint_progresses = SprintProgress.objects.filter(enrollment=enrollment)
        for sp in sprint_progresses:
            summary['sprint_progress'].append({
                'sprint_name': sp.sprint.name,
                'status': sp.status,
                'completion_percentage': sp.completion_percentage,
                'started_on': sp.started_on,
                'completed_on': sp.completed_on
            })
        
        # Get module progress
        module_progresses = ModuleProgress.objects.filter(enrollment=enrollment)
        for mp in module_progresses:
            summary['module_progress'].append({
                'module_name': mp.module.name,
                'status': mp.status,
                'completion_percentage': mp.completion_percentage,
                'topic_count': TopicProgress.objects.filter(module_progress=mp).count(),
                'completed_topics': TopicProgress.objects.filter(
                    module_progress=mp, status='completed'
                ).count()
            })
        
        # Get project progress
        project_progresses = ProjectProgress.objects.filter(enrollment=enrollment)
        for pp in project_progresses:
            summary['project_progress'].append({
                'project_name': pp.project.name,
                'status': pp.status,
                'completion_percentage': pp.completion_percentage,
                'started_on': pp.started_on,
                'completed_on': pp.completed_on
            })
        
        return Response(summary)


class InstructorDashboardView(APIView):
    """
    Dashboard view for instructors to monitor student progress
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        course_id = request.query_params.get('course_id')
        
        if course_id:
            enrollments = CourseEnrollment.objects.filter(course_id=course_id)
        else:
            enrollments = CourseEnrollment.objects.all()
        
        dashboard_data = {
            'overview': {
                'total_enrollments': enrollments.count(),
                'active_enrollments': enrollments.filter(status='active').count(),
                'completed_enrollments': enrollments.filter(status='completed').count(),
                'average_completion': enrollments.aggregate(
                    avg_completion=Avg('completion_percentage')
                )['avg_completion'] or 0
            },
            'student_progress': [],
            'course_analytics': {}
        }
        
        # Get individual student progress
        for enrollment in enrollments:
            student_data = {
                'student_name': enrollment.user.get_full_name() or enrollment.user.username,
                'course_name': enrollment.course.name,
                'enrollment_date': enrollment.enrolled_on,
                'status': enrollment.status,
                'completion_percentage': enrollment.completion_percentage,
                'last_activity': enrollment.updated_at
            }
            dashboard_data['student_progress'].append(student_data)
        
        return Response(dashboard_data)


class ProgressAnalyticsView(APIView):
    """
    Advanced analytics for course and student progress
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        time_range = request.query_params.get('range', '30')  # days
        end_date = timezone.now()
        start_date = end_date - timedelta(days=int(time_range))
        
        analytics = {
            'enrollment_trends': self._get_enrollment_trends(start_date, end_date),
            'completion_rates': self._get_completion_rates(),
            'performance_metrics': self._get_performance_metrics(),
            'engagement_metrics': self._get_engagement_metrics(start_date, end_date)
        }
        
        return Response(analytics)
    
    def _get_enrollment_trends(self, start_date, end_date):
        """Get enrollment trends over time"""
        return CourseEnrollment.objects.filter(
            enrolled_on__range=[start_date, end_date]
        ).extra(
            select={'day': 'date(enrolled_on)'}
        ).values('day').annotate(count=Count('id')).order_by('day')
    
    def _get_completion_rates(self):
        """Get completion rates by course"""
        return CourseEnrollment.objects.values('course__name').annotate(
            total_enrollments=Count('id'),
            completed=Count('id', filter=Q(status='completed')),
            completion_rate=Case(
                When(total_enrollments=0, then=Value(0)),
                default=F('completed') * 100.0 / F('total_enrollments')
            )
        )
    
    def _get_performance_metrics(self):
        """Get task performance metrics"""
        return TaskProgress.objects.aggregate(
            total_tasks=Count('id'),
            completed_tasks=Count('id', filter=Q(status='completed')),
            average_score=Avg('score'),
            high_performers=Count('id', filter=Q(score__gte=90)),
            low_performers=Count('id', filter=Q(score__lt=60))
        )
    
    def _get_engagement_metrics(self, start_date, end_date):
        """Get engagement metrics"""
        return {
            'active_learners': CourseEnrollment.objects.filter(
                updated_at__range=[start_date, end_date],
                status='active'
            ).count(),
            'daily_active_users': CourseEnrollment.objects.filter(
                updated_at__date=timezone.now().date(),
                status='active'
            ).count()
        }


class BulkProgressUpdateView(APIView):
    """
    Bulk update progress for multiple students/tasks
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        updates = request.data.get('updates', [])
        results = []
        
        with transaction.atomic():
            for update in updates:
                try:
                    model_type = update.get('type')
                    object_id = update.get('id')
                    data = update.get('data', {})
                    
                    if model_type == 'task_progress':
                        obj = TaskProgress.objects.get(id=object_id)
                        for key, value in data.items():
                            setattr(obj, key, value)
                        obj.save()
                        
                    elif model_type == 'module_progress':
                        obj = ModuleProgress.objects.get(id=object_id)
                        for key, value in data.items():
                            setattr(obj, key, value)
                        obj.save()
                    
                    results.append({'id': object_id, 'status': 'updated'})
                    
                except Exception as e:
                    results.append({'id': object_id, 'status': 'error', 'message': str(e)})
        
        return Response({'results': results})


class EnrollmentStatsView(APIView):
    """
    Get enrollment statistics and reports
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        stats = {
            'total_enrollments': CourseEnrollment.objects.count(),
            'status_breakdown': CourseEnrollment.objects.values('status').annotate(
                count=Count('id')
            ),
            'monthly_enrollments': CourseEnrollment.objects.extra(
                select={'month': 'EXTRACT(month FROM enrolled_on)', 'year': 'EXTRACT(year FROM enrolled_on)'}
            ).values('month', 'year').annotate(count=Count('id')).order_by('year', 'month'),
            'top_courses': CourseEnrollment.objects.values('course__name').annotate(
                enrollment_count=Count('id')
            ).order_by('-enrollment_count')[:10]
        }
        
        return Response(stats)


class LearnerProfileView(APIView):
    """
    Comprehensive learner profile with all progress data
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        profile = {
            'personal_info': {
                'username': user.username,
                'full_name': user.get_full_name(),
                'email': user.email,
                'date_joined': user.date_joined
            },
            'learning_summary': {
                'total_enrollments': CourseEnrollment.objects.filter(user=user).count(),
                'completed_courses': CourseEnrollment.objects.filter(
                    user=user, status='completed'
                ).count(),
                'total_tasks_completed': TaskProgress.objects.filter(
                    subtopic_progress__topic_progress__module_progress__enrollment__user=user,
                    status='completed'
                ).count(),
                'average_score': TaskProgress.objects.filter(
                    subtopic_progress__topic_progress__module_progress__enrollment__user=user
                ).aggregate(avg_score=Avg('score'))['avg_score'] or 0
            },
            'achievements': self._get_achievements(user),
            'recent_activity': self._get_recent_activity(user)
        }
        
        return Response(profile)
    
    def _get_achievements(self, user):
        """Get learner achievements and milestones"""
        achievements = []
        
        # Course completion achievements
        completed_courses = CourseEnrollment.objects.filter(
            user=user, status='completed'
        ).count()
        
        if completed_courses >= 1:
            achievements.append('First Course Completed')
        if completed_courses >= 5:
            achievements.append('Learning Enthusiast')
        if completed_courses >= 10:
            achievements.append('Course Master')
        
        # Task performance achievements
        high_score_tasks = TaskProgress.objects.filter(
            subtopic_progress__topic_progress__module_progress__enrollment__user=user,
            score__gte=95
        ).count()
        
        if high_score_tasks >= 10:
            achievements.append('High Achiever')
        
        return achievements
    
    def _get_recent_activity(self, user):
        """Get recent learning activity"""
        recent_tasks = TaskProgress.objects.filter(
            subtopic_progress__topic_progress__module_progress__enrollment__user=user,
            updated_at__gte=timezone.now() - timedelta(days=7)
        ).order_by('-updated_at')[:10]
        
        activity = []
        for task in recent_tasks:
            activity.append({
                'type': 'task_progress',
                'description': f"Completed {task.task.name}",
                'date': task.updated_at,
                'score': task.score
            })
        
        return activity


class CourseCompletionView(APIView):
    """
    Handle course completion ceremonies and certificates
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, enrollment_id):
        enrollment = get_object_or_404(
            CourseEnrollment, 
            id=enrollment_id, 
            user=request.user
        )
        
        if enrollment.completion_percentage >= 100:
            enrollment.status = 'completed'
            enrollment.completed_on = timezone.now()
            enrollment.save()
            
            # Here you would trigger certificate generation
            # send completion notifications, etc.
            
            return Response({
                'status': 'course completed',
                'completion_date': enrollment.completed_on,
                'certificate_available': True
            })
        
        return Response({
            'error': 'Course not yet completed',
            'completion_percentage': enrollment.completion_percentage
        }, status=status.HTTP_400_BAD_REQUEST)