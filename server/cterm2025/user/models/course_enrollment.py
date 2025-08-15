import uuid
from django.db import models
from django.utils import timezone

class CourseEnrollment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('withdrawn', 'Withdrawn'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        'CustomUser', 
        on_delete=models.CASCADE,
        related_name='course_enrollments'
    )
    course = models.ForeignKey(
        'Course', 
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrolled_on = models.DateTimeField(default=timezone.now)
    completed_on = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    completion_percentage = models.FloatField(default=0.0)

    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-enrolled_on']

    def __str__(self):
        return f"{self.user} enrolled in {self.course} - Status: {self.status}"

class SprintProgress(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enrollment = models.ForeignKey(
        'CourseEnrollment', 
        on_delete=models.CASCADE,
        related_name='sprint_progresses'
    )
    sprint = models.ForeignKey(
        'Sprint', 
        on_delete=models.CASCADE,
        related_name='progresses'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    completion_percentage = models.FloatField(default=0.0)
    started_on = models.DateTimeField(null=True, blank=True)
    completed_on = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('enrollment', 'sprint')
        ordering = ['sprint__start_date']

    def __str__(self):
        return f"{self.enrollment.user} - {self.sprint.name} Progress: {self.status}"
    

class ModuleProgress(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enrollment = models.ForeignKey(
        'CourseEnrollment', 
        on_delete=models.CASCADE,
        related_name='module_progresses'  # update related_name
    )
    module = models.ForeignKey(
        'Module',  # track Module, not Sprint
        on_delete=models.CASCADE,
        related_name='progresses'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    completion_percentage = models.FloatField(default=0.0)
    started_on = models.DateTimeField(null=True, blank=True)
    completed_on = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('enrollment', 'module')
        ordering = ['module__start_date']

    def __str__(self):
        return f"{self.enrollment.user} - {self.module.name} Progress: {self.status}"


class TopicProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module_progress = models.ForeignKey(
        'ModuleProgress', 
        on_delete=models.CASCADE, 
        related_name='topic_progresses'
    )
    topic = models.ForeignKey('Topic', on_delete=models.CASCADE)
    started_on = models.DateTimeField(null=True, blank=True)
    completed_on = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=10, 
        choices=[('active', 'Active'), ('completed', 'Completed')],
        default='active'
    )


class SubTopicProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    topic_progress = models.ForeignKey(
        'TopicProgress', 
        on_delete=models.CASCADE, 
        related_name='subtopic_progresses'
    )
    subtopic = models.ForeignKey('SubTopic', on_delete=models.CASCADE)
    started_on = models.DateTimeField(null=True, blank=True)
    completed_on = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=[('active', 'Active'), ('completed', 'Completed')],
        default='active'
    )

class TaskProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subtopic_progress = models.ForeignKey(
        'SubTopicProgress',
        on_delete=models.CASCADE,
        related_name='task_progresses',
        null=True,
        blank=True
    )

    task = models.ForeignKey('Task', on_delete=models.CASCADE)
    started_on = models.DateTimeField(null=True, blank=True)
    completed_on = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    max_score = models.FloatField(null=True, blank=True)
    
    status = models.CharField(
        max_length=10,
        choices=[('active', 'Active'), ('completed', 'Completed')],
        default='active'
    )
    task_type = models.CharField(max_length=20, blank=True, null=True)

