from rest_framework import serializers
from django.db.models import Count, Avg, Q
from django.utils import timezone
from user.models.course_model import Course
from user.models.user_models import CustomUser

from user.models.course_enrollment import (
    CourseEnrollment, SprintProgress, ModuleProgress, 
    TopicProgress, SubTopicProgress, TaskProgress, ProjectProgress
)
class TaskProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for individual task progress tracking
    """
    task_name = serializers.CharField(source='task.name', read_only=True)
    task_description = serializers.CharField(source='task.description', read_only=True)
    percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = TaskProgress
        fields = [
            'id', 'task', 'task_name', 'task_description', 
            'status', 'task_type', 'started_on', 'completed_on', 
            'score', 'max_score', 'percentage', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']

    def validate_score(self, value):
        """Validate task score"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Score cannot be negative")
        return value

    def validate(self, data):
        """Validate task progress data"""
        if data.get('score') and data.get('max_score'):
            if data['score'] > data['max_score']:
                raise serializers.ValidationError("Score cannot exceed maximum score")
        return data


class SubTopicProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for subtopic progress with task details
    """
    subtopic_name = serializers.CharField(source='subtopic.name', read_only=True)
    subtopic_description = serializers.CharField(source='subtopic.description', read_only=True)
    task_progresses = TaskProgressSerializer(many=True, read_only=True)
    tasks_completed = serializers.SerializerMethodField()
    tasks_total = serializers.SerializerMethodField()
    average_score = serializers.SerializerMethodField()
    
    class Meta:
        model = SubTopicProgress
        fields = [
            'id', 'subtopic', 'subtopic_name', 'subtopic_description',
            'status', 'started_on', 'completed_on', 'updated_at',
            'task_progresses', 'tasks_completed', 'tasks_total', 'average_score'
        ]
        read_only_fields = ['id', 'updated_at']

    def get_tasks_completed(self, obj):
        """Get count of completed tasks"""
        return obj.task_progresses.filter(status='completed').count()

    def get_tasks_total(self, obj):
        """Get total count of tasks"""
        return obj.task_progresses.count()

    def get_average_score(self, obj):
        """Get average score for completed tasks"""
        completed_tasks = obj.task_progresses.filter(
            status='completed', 
            score__isnull=False
        )
        if completed_tasks.exists():
            return completed_tasks.aggregate(avg_score=Avg('score'))['avg_score']
        return None


class TopicProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for topic progress with subtopic breakdown
    """
    topic_name = serializers.CharField(source='topic.name', read_only=True)
    topic_description = serializers.CharField(source='topic.description', read_only=True)
    subtopic_progresses = SubTopicProgressSerializer(many=True, read_only=True)
    completion_summary = serializers.SerializerMethodField()
    
    class Meta:
        model = TopicProgress
        fields = [
            'id', 'topic', 'topic_name', 'topic_description',
            'status', 'started_on', 'completed_on', 'updated_at',
            'subtopic_progresses', 'completion_summary'
        ]
        read_only_fields = ['id', 'updated_at']

    def get_completion_summary(self, obj):
        """Get completion summary for subtopics"""
        subtopics = obj.subtopic_progresses.all()
        total = subtopics.count()
        completed = subtopics.filter(status='completed').count()
        in_progress = subtopics.filter(status='in_progress').count()
        
        return {
            'total_subtopics': total,
            'completed_subtopics': completed,
            'in_progress_subtopics': in_progress,
            'completion_rate': (completed / total * 100) if total > 0 else 0
        }


class ModuleProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for module progress with topic breakdown
    """
    module_name = serializers.CharField(source='module.name', read_only=True)
    module_description = serializers.CharField(source='module.description', read_only=True)
    module_duration = serializers.CharField(source='module.duration', read_only=True)
    topic_progresses = TopicProgressSerializer(many=True, read_only=True)
    progress_stats = serializers.SerializerMethodField()
    
    class Meta:
        model = ModuleProgress
        fields = [
            'id', 'module', 'module_name', 'module_description', 
            'module_duration', 'status', 'completion_percentage',
            'started_on', 'completed_on', 'updated_at',
            'topic_progresses', 'progress_stats'
        ]
        read_only_fields = ['id', 'updated_at']

    def get_progress_stats(self, obj):
        """Get detailed progress statistics for the module"""
        topics = obj.topic_progresses.all()
        
        # Topic statistics
        total_topics = topics.count()
        completed_topics = topics.filter(status='completed').count()
        in_progress_topics = topics.filter(status='in_progress').count()
        
        # Task statistics across all topics
        total_tasks = 0
        completed_tasks = 0
        total_score = 0
        scored_tasks = 0
        
        for topic in topics:
            for subtopic in topic.subtopic_progresses.all():
                tasks = subtopic.task_progresses.all()
                total_tasks += tasks.count()
                completed_task_count = tasks.filter(status='completed').count()
                completed_tasks += completed_task_count
                
                # Calculate scores
                for task in tasks.filter(status='completed', score__isnull=False):
                    total_score += task.percentage or 0
                    scored_tasks += 1
        
        return {
            'topics': {
                'total': total_topics,
                'completed': completed_topics,
                'in_progress': in_progress_topics,
                'completion_rate': (completed_topics / total_topics * 100) if total_topics > 0 else 0
            },
            'tasks': {
                'total': total_tasks,
                'completed': completed_tasks,
                'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
                'average_score': (total_score / scored_tasks) if scored_tasks > 0 else None
            }
        }

    def validate_completion_percentage(self, value):
        """Validate completion percentage"""
        if not (0 <= value <= 100):
            raise serializers.ValidationError("Completion percentage must be between 0 and 100")
        return value


class SprintProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for sprint progress tracking
    """
    sprint_name = serializers.CharField(source='sprint.name', read_only=True)
    sprint_description = serializers.CharField(source='sprint.description', read_only=True)
    sprint_start_date = serializers.DateTimeField(source='sprint.start_date', read_only=True)
    sprint_end_date = serializers.DateTimeField(source='sprint.end_date', read_only=True)
    duration_days = serializers.SerializerMethodField()
    time_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = SprintProgress
        fields = [
            'id', 'sprint', 'sprint_name', 'sprint_description',
            'sprint_start_date', 'sprint_end_date', 'status',
            'completion_percentage', 'started_on', 'completed_on',
            'updated_at', 'duration_days', 'time_remaining'
        ]
        read_only_fields = ['id', 'updated_at']

    def get_duration_days(self, obj):
        """Calculate sprint duration in days"""
        if obj.sprint.start_date and obj.sprint.end_date:
            return (obj.sprint.end_date - obj.sprint.start_date).days
        return None

    def get_time_remaining(self, obj):
        """Calculate time remaining in sprint"""
        if obj.sprint.end_date and obj.status != 'completed':
            remaining = obj.sprint.end_date - timezone.now()
            return remaining.days if remaining.days > 0 else 0
        return None

    def validate_completion_percentage(self, value):
        """Validate completion percentage"""
        if not (0 <= value <= 100):
            raise serializers.ValidationError("Completion percentage must be between 0 and 100")
        return value


class ProjectProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for project progress tracking
    """
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_description = serializers.CharField(source='project.description', read_only=True)
    project_difficulty = serializers.CharField(source='project.difficulty', read_only=True)
    project_type = serializers.CharField(source='project.project_type', read_only=True)
    estimated_hours = serializers.IntegerField(source='project.estimated_hours', read_only=True)
    time_spent = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectProgress
        fields = [
            'id', 'project', 'project_name', 'project_description',
            'project_difficulty', 'project_type', 'estimated_hours',
            'status', 'completion_percentage', 'started_on', 
            'completed_on', 'updated_at', 'time_spent'
        ]
        read_only_fields = ['id', 'updated_at']

    def get_time_spent(self, obj):
        """Calculate time spent on project"""
        if obj.started_on:
            end_time = obj.completed_on or timezone.now()
            return (end_time - obj.started_on).days
        return 0

    def validate_completion_percentage(self, value):
        """Validate completion percentage"""
        if not (0 <= value <= 100):
            raise serializers.ValidationError("Completion percentage must be between 0 and 100")
        return value


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    """
    Main serializer for course enrollments with comprehensive progress data
    """

    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        error_messages={
            "does_not_exist": "Course not found.",
            "invalid": "Invalid course ID."
        }
    )
    
    # User field - writable for admin, read-only for students
    user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        required=False,
        error_messages={
            "does_not_exist": "User not found.",
            "invalid": "Invalid user ID."
        }
    )
    
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_description = serializers.CharField(source='course.description', read_only=True)
    course_duration = serializers.CharField(source='course.duration', read_only=True)

    # Progress relationships
    sprint_progresses = SprintProgressSerializer(many=True, read_only=True)
    module_progresses = ModuleProgressSerializer(many=True, read_only=True)
    project_progresses = ProjectProgressSerializer(many=True, read_only=True)

    # Computed fields
    overall_progress = serializers.SerializerMethodField()
    time_enrolled = serializers.SerializerMethodField()
    next_milestone = serializers.SerializerMethodField()

    class Meta:
        model = CourseEnrollment
        fields = [
            'id', 'user', 'course', 'user_name', 'user_email',
            'course_name', 'course_description', 'course_duration',
            'enrolled_on', 'completed_on', 'status', 'completion_percentage',
            'is_active', 'updated_at', 'sprint_progresses',
            'module_progresses', 'project_progresses', 'overall_progress',
            'time_enrolled', 'next_milestone'
        ]
        read_only_fields = ['id', 'enrolled_on', 'updated_at']

    def validate(self, data):
        """Global validation with proper user handling"""
        request = self.context.get("request")
        current_user = self.context.get("user") or getattr(request, "user", None)
        
        # Handle user assignment based on user type
        if not self.instance:  # Creating new enrollment
            if current_user.user_type == "student":
                data["user"] = current_user
            elif current_user.user_type == "admin":
                if not data.get("user"):
                    raise serializers.ValidationError({
                        "error": "Admin must specify a user for enrollment."
                    })
            else:
                raise serializers.ValidationError({
                    "error": "You are not allowed to create enrollments."
                })
        
        user = data.get("user", self.instance.user if self.instance else None)
        course = data.get("course", self.instance.course if self.instance else None)

        if not course:
            raise serializers.ValidationError({
                "error": "A valid course must be provided."
            })

        if not self.instance and CourseEnrollment.objects.filter(user=user, course=course).exists():
            raise serializers.ValidationError({
                "error": "This user is already enrolled in the selected course."
            })

        if getattr(course, "is_archived", False):
            raise serializers.ValidationError({
                "error": "This course is archived and cannot accept enrollments."
            })

        if getattr(course, "status", None) == "completed":
            raise serializers.ValidationError({
                "error": "This course has completed and cannot accept new enrollments."
            })

        return data

    def validate_user(self, value):
        """Validate user field based on current user permissions"""
        request_user = self.context.get("user")
        
        if request_user and request_user.user_type != "admin":
            # Non-admin users can only enroll themselves
            if value != request_user:
                raise serializers.ValidationError(
                    "You can only enroll yourself in courses."
                )
        
        return value

    def validate_status(self, value):
        """Validate enrollment status transitions"""
        if self.instance:
            current_status = self.instance.status
            valid_transitions = {
                'pending': ['active', 'withdrawn'],
                'active': ['paused', 'completed', 'withdrawn'],
                'paused': ['active', 'withdrawn'],
                'completed': [],
                'withdrawn': []
            }

            if value not in valid_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"Cannot transition from {current_status} to {value}"
                )

        return value

    # Rest of the methods remain the same...
    def get_overall_progress(self, obj):
        """Get comprehensive progress overview"""
        sprints = obj.sprint_progresses.all()
        sprint_stats = {
            'total': sprints.count(),
            'completed': sprints.filter(status='completed').count(),
            'in_progress': sprints.filter(status='in_progress').count(),
            'avg_completion': sprints.aggregate(avg=Avg('completion_percentage'))['avg'] or 0
        }

        modules = obj.module_progresses.all()
        module_stats = {
            'total': modules.count(),
            'completed': modules.filter(status='completed').count(),
            'in_progress': modules.filter(status='in_progress').count(),
            'avg_completion': modules.aggregate(avg=Avg('completion_percentage'))['avg'] or 0
        }

        projects = obj.project_progresses.all()
        project_stats = {
            'total': projects.count(),
            'completed': projects.filter(status='completed').count(),
            'in_progress': projects.filter(status='in_progress').count(),
            'avg_completion': projects.aggregate(avg=Avg('completion_percentage'))['avg'] or 0
        }

        total_tasks = 0
        completed_tasks = 0
        for module in modules:
            for topic in module.topic_progresses.all():
                for subtopic in topic.subtopic_progresses.all():
                    tasks = subtopic.task_progresses.all()
                    total_tasks += tasks.count()
                    completed_tasks += tasks.filter(status='completed').count()

        task_stats = {
            'total': total_tasks,
            'completed': completed_tasks,
            'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        }

        return {
            'sprints': sprint_stats,
            'modules': module_stats,
            'projects': project_stats,
            'tasks': task_stats
        }

    def get_time_enrolled(self, obj):
        """Get time since enrollment"""
        return (timezone.now() - obj.enrolled_on).days

    def get_next_milestone(self, obj):
        """Get next milestone/deadline"""
        next_sprint = obj.sprint_progresses.filter(
            status__in=['not_started', 'in_progress']
        ).first()

        next_module = obj.module_progresses.filter(
            status__in=['not_started', 'in_progress']
        ).first()

        next_project = obj.project_progresses.filter(
            status__in=['not_started', 'in_progress']
        ).first()

        milestones = []
        if next_sprint:
            milestones.append({
                'type': 'sprint',
                'name': next_sprint.sprint.name,
                'due_date': getattr(next_sprint.sprint, 'end_date', None)
            })
        if next_module:
            milestones.append({
                'type': 'module',
                'name': next_module.module.name,
                'due_date': getattr(next_module.module, 'end_date', None)
            })
        if next_project:
            milestones.append({
                'type': 'project',
                'name': next_project.project.name,
                'due_date': getattr(next_project.project, 'due_date', None)
            })

        if milestones:
            milestones_with_dates = [m for m in milestones if m['due_date']]
            if milestones_with_dates:
                return min(milestones_with_dates, key=lambda x: x['due_date'])
            return milestones[0]

        return None
    

class ProgressSummarySerializer(serializers.Serializer):
    """
    Serializer for progress summary data used in dashboards
    """
    enrollment_id = serializers.UUIDField()
    learner_name = serializers.CharField()
    course_name = serializers.CharField()
    enrollment_date = serializers.DateTimeField()
    status = serializers.CharField()
    completion_percentage = serializers.FloatField()
    last_activity = serializers.DateTimeField()
    
    # Progress breakdown
    sprints_completed = serializers.IntegerField()
    total_sprints = serializers.IntegerField()
    modules_completed = serializers.IntegerField()
    total_modules = serializers.IntegerField()
    projects_completed = serializers.IntegerField()
    total_projects = serializers.IntegerField()
    tasks_completed = serializers.IntegerField()
    total_tasks = serializers.IntegerField()
    
    # Performance metrics
    average_task_score = serializers.FloatField(allow_null=True)
    high_performing_tasks = serializers.IntegerField()  # Tasks with score >= 90
    time_spent_days = serializers.IntegerField()
    
    # Engagement metrics
    days_since_last_activity = serializers.IntegerField()
    weekly_activity_count = serializers.IntegerField()
    
    class Meta:
        fields = [
            'enrollment_id', 'learner_name', 'course_name', 'enrollment_date',
            'status', 'completion_percentage', 'last_activity',
            'sprints_completed', 'total_sprints', 'modules_completed', 
            'total_modules', 'projects_completed', 'total_projects',
            'tasks_completed', 'total_tasks', 'average_task_score',
            'high_performing_tasks', 'time_spent_days', 'days_since_last_activity',
            'weekly_activity_count'
        ]


class BulkProgressUpdateSerializer(serializers.Serializer):
    """
    Serializer for bulk progress updates
    """
    updates = serializers.ListField(
        child=serializers.DictField(),
        help_text="List of update objects with type, id, and data fields"
    )
    
    def validate_updates(self, value):
        """Validate bulk update data structure"""
        required_fields = ['type', 'id', 'data']
        valid_types = ['task_progress', 'module_progress', 'topic_progress', 'subtopic_progress']
        
        for update in value:
            # Check required fields
            for field in required_fields:
                if field not in update:
                    raise serializers.ValidationError(f"Missing required field: {field}")
            
            # Validate type
            if update['type'] not in valid_types:
                raise serializers.ValidationError(f"Invalid type: {update['type']}")
            
            # Validate data structure
            if not isinstance(update['data'], dict):
                raise serializers.ValidationError("Data field must be a dictionary")
        
        return value


class LearnerAnalyticsSerializer(serializers.Serializer):
    """
    Serializer for learner analytics and insights
    """
    learner_id = serializers.UUIDField()
    total_enrollments = serializers.IntegerField()
    active_enrollments = serializers.IntegerField()
    completed_courses = serializers.IntegerField()
    total_learning_time = serializers.IntegerField()  # in days
    
    performance_metrics = serializers.DictField(child=serializers.FloatField())
    learning_velocity = serializers.FloatField()  # tasks completed per week
    consistency_score = serializers.FloatField()   # based on regular activity
    
    strengths = serializers.ListField(child=serializers.CharField())
    areas_for_improvement = serializers.ListField(child=serializers.CharField())
    
    recent_achievements = serializers.ListField(child=serializers.CharField())
    upcoming_deadlines = serializers.ListField(child=serializers.DictField())
    
    class Meta:
        fields = [
            'learner_id', 'total_enrollments', 'active_enrollments',
            'completed_courses', 'total_learning_time', 'performance_metrics',
            'learning_velocity', 'consistency_score', 'strengths',
            'areas_for_improvement', 'recent_achievements', 'upcoming_deadlines'
        ]


class InstructorAnalyticsSerializer(serializers.Serializer):
    """
    Serializer for instructor dashboard analytics
    """
    course_id = serializers.UUIDField(allow_null=True)
    total_students = serializers.IntegerField()
    active_students = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    average_progress = serializers.FloatField()
    
    # Performance distribution
    high_performers = serializers.IntegerField()  # >80% avg score
    average_performers = serializers.IntegerField()  # 60-80% avg score
    struggling_students = serializers.IntegerField()  # <60% avg score
    
    # Engagement metrics
    daily_active_students = serializers.IntegerField()
    weekly_active_students = serializers.IntegerField()
    students_at_risk = serializers.IntegerField()  # No activity in 7+ days
    
    # Content analytics
    most_difficult_topics = serializers.ListField(child=serializers.DictField())
    fastest_completed_modules = serializers.ListField(child=serializers.DictField())
    
    class Meta:
        fields = [
            'course_id', 'total_students', 'active_students', 'completion_rate',
            'average_progress', 'high_performers', 'average_performers',
            'struggling_students', 'daily_active_students', 'weekly_active_students',
            'students_at_risk', 'most_difficult_topics', 'fastest_completed_modules'
        ]


# Lightweight serializers for list views and quick responses
class CourseEnrollmentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for enrollment lists"""
    course_name = serializers.CharField(source='course.name', read_only=True)
    
    class Meta:
        model = CourseEnrollment
        fields = ['id', 'course_name', 'status', 'completion_percentage', 'enrolled_on']


class ProgressQuickUpdateSerializer(serializers.Serializer):
    """Quick serializer for progress updates via API"""
    completion_percentage = serializers.FloatField(min_value=0, max_value=100)
    status = serializers.ChoiceField(choices=['not_started', 'in_progress', 'completed'])
    notes = serializers.CharField(max_length=500, required=False, allow_blank=True)


class TaskSubmissionSerializer(serializers.Serializer):
    """Serializer for task submissions"""
    task_id = serializers.UUIDField()
    score = serializers.FloatField(min_value=0, required=False)
    max_score = serializers.FloatField(min_value=0, required=False)
    submission_data = serializers.JSONField(required=False)
    notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    
    def validate(self, data):
        if 'score' in data and 'max_score' in data:
            if data['score'] > data['max_score']:
                raise serializers.ValidationError("Score cannot exceed maximum score")
        return data