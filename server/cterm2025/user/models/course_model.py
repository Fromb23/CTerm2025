from django.db import models
from django.utils import timezone


class Course(models.Model):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    syllabus_url = models.URLField(blank=True, null=True)
    prerequisites = models.TextField(blank=True, null=True)
    estimated_duration = models.PositiveIntegerField(help_text="Duration in days")
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order_index = models.PositiveIntegerField(default=1)
    estimated_hours = models.PositiveIntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order_index"]
        unique_together = ("course", "order_index")

    def __str__(self):
        return f"{self.course.name} - {self.title}"


class Content(models.Model):
    CONTENT_TYPES = [
        ("video", "Video"),
        ("article", "Article"),
        ("quiz", "Quiz"),
        ("assignment", "Assignment"),
    ]

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="contents")
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    url = models.TextField()
    duration_minutes = models.PositiveIntegerField(blank=True, null=True)
    order_index = models.PositiveIntegerField(default=1)
    is_free_preview = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order_index"]
        unique_together = ("module", "order_index")

    def __str__(self):
        return f"{self.module.title} - {self.title}"


class Topic(models.Model):
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name="topics")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order_index = models.PositiveIntegerField(default=1)
    is_optional = models.BooleanField(default=False)
    estimated_minutes = models.PositiveIntegerField(blank=True, null=True)
    prerequisite_topic = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="dependent_topics"
    )
    has_quiz = models.BooleanField(default=False)
    quiz_passing_score = models.PositiveIntegerField(default=70)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order_index"]
        unique_together = ("content", "order_index")

    def __str__(self):
        return f"{self.content.title} - {self.title}"


class Task(models.Model):
    TASK_TYPES = [
        ("quiz", "Quiz"),
        ("code", "Code"),
        ("project", "Project"),
        ("reflection", "Reflection"),
        ("project_task", "Project Task"),
    ]

    SUBMISSION_FORMATS = [
        ("text", "Text"),
        ("file", "File"),
        ("link", "Link"),
        ("multiple_choice", "Multiple Choice"),
    ]

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    task_type = models.CharField(max_length=20, choices=TASK_TYPES)
    is_mandatory = models.BooleanField(default=True)
    submission_format = models.CharField(max_length=20, choices=SUBMISSION_FORMATS)
    max_score = models.PositiveIntegerField(blank=True, null=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    unlocks_next_topic = models.BooleanField(default=True)
    first_deadline = models.DateTimeField()
    second_deadline = models.DateTimeField(blank=True, null=True)
    third_deadline = models.DateTimeField(blank=True, null=True)
    is_final_project = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["first_deadline"]

    def __str__(self):
        return f"{self.topic.title} - {self.title}"
