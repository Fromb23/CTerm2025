from django.db import models
from django.utils import timezone
from .course_model import Module, Task
from .user_models import CustomUser

# --- Assessment Weight ---
class AssessmentWeight(models.Model):
    TASK_TYPES = [
        ("quiz", "Quiz"),
        ("code", "Code"),
        ("project", "Project"),
        ("reflection", "Reflection"),
    ]

    id = models.AutoField(primary_key=True)
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name="assessment_weights")
    task_type = models.CharField(max_length=20, choices=TASK_TYPES)
    weight_percent = models.DecimalField(max_digits=5, decimal_places=2)
    max_score = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("course", "task_type")

# --- Checker Result (for code tasks) ---
class CheckerResult(models.Model):
    STATUS_CHOICES = [
        ("pass", "Pass"),
        ("fail", "Fail"),
        ("error", "Error"),
    ]

    id = models.AutoField(primary_key=True)
    task_progress = models.ForeignKey('TaskProgress', on_delete=models.CASCADE, related_name="checker_results")
    stdout = models.TextField(blank=True, null=True)
    stderr = models.TextField(blank=True, null=True)
    exit_code = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    score_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    details = models.JSONField(blank=True, null=True)
    checked_at = models.DateTimeField(default=timezone.now)

# --- Quiz Submission ---
class QuizSubmission(models.Model):
    id = models.AutoField(primary_key=True)
    quiz_task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="quiz_submissions")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="quiz_submissions")
    answers = models.JSONField()
    score = models.DecimalField(max_digits=5, decimal_places=2)
    submitted_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("quiz_task", "user")

# --- Final Project Submission ---
class FinalProjectSubmission(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="final_project_submissions")
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="final_project_submissions")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    submission_link = models.TextField()
    submitted_at = models.DateTimeField(default=timezone.now)
    reviewed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviewed_projects")
    review_notes = models.TextField(blank=True, null=True)
    grade_awarded = models.PositiveIntegerField(null=True, blank=True)
    is_passed = models.BooleanField(default=False)