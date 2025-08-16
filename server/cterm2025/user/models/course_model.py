from django.db import models
from django.utils import timezone


class Course(models.Model):
    name = models.CharField(max_length=255, unique=True)
    course_code = models.CharField(max_length=50, blank=True, null=True)
    duration = models.PositiveIntegerField(help_text="Duration in weeks")
    mode_of_learning = models.CharField(max_length=50, choices=[
        ("online", "Online"),
        ("offline", "Offline"),
        ("hybrid", "Hybrid")
    ])
    commitment_time = models.PositiveIntegerField(help_text="Commitment time in hours per week")
    requirements = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    frequently_asked_questions = models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class Sprint(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    duration = models.PositiveIntegerField(help_text="Duration in weeks")
    start_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="sprints")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date"]
        unique_together = ("course", "name")

class Module(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    start_date = models.DateField(blank=True, null=True)
    order_index = models.PositiveIntegerField(default=0, help_text="Order of the module in the sprint")
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ("draft", "Draft"),
        ("active", "Active"),
        ("completed", "Completed"),
        ("archived", "Archived")
    ], default="draft")
    sprint = models.ForeignKey(Sprint, on_delete=models.CASCADE, related_name="modules")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order_index"]
        unique_together = ("sprint", "order_index")

    def __str__(self):
        return f"{self.sprint.name} - {self.name}"


class Topic(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    order_index = models.PositiveIntegerField(default=0, help_text="Order of the topic in the module")
    resource_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order_index"]
        unique_together = ("module", "name")

    def __str__(self):
        return f"{self.module.name} - {self.name}"

class SubTopic(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    resource_url = models.URLField(blank=True, null=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="subtopics")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        unique_together = ("topic", "name")

    def __str__(self):
        return f"{self.topic.name} - {self.name}"

class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sprint = models.ForeignKey(Sprint, on_delete=models.CASCADE, related_name="projects")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date"]

    def __str__(self):
        return f"{self.name} - {self.start_date.strftime('%Y-%m-%d')}  - {self.end_date.strftime('%Y-%m-%d') if self.end_date else 'Ongoing'}"

class Task(models.Model):
    TASK_TYPES = [
        ("quiz", "Quiz"),
        ("code", "Code"),
        ("reflection", "Reflection"),
    ]

    SUBMISSION_FORMATS = [
        ("text", "Text"),
        ("file", "File"),
        ("link", "Link"),
        ("multiple_choice", "Multiple Choice"),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)    
    description = models.TextField(blank=True, null=True)
    task_type = models.CharField(max_length=20, choices=TASK_TYPES)
    is_mandatory = models.BooleanField(default=True)
    submission_format = models.CharField(max_length=20, choices=SUBMISSION_FORMATS)
    max_score = models.PositiveIntegerField(blank=True, null=True)
    unlocks_next_topic = models.BooleanField(default=True)
    first_deadline = models.DateTimeField()
    second_deadline = models.DateTimeField(blank=True, null=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="tasks", null=True, blank=True)
    project = models.ForeignKey(Project, related_name="tasks", on_delete=models.CASCADE)
    third_deadline = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["first_deadline"]

    def __str__(self):
        return f"{self.topic.title} - {self.name} ({self.get_task_type_display()})"

  
class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    total_marks = models.PositiveIntegerField()
    tasks = models.ForeignKey(Task, related_name="quizzes", on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date"]

    def __str__(self):
        return f"{self.name} - {self.total_marks} marks"
    
class CodeTask(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    tasks = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="code_tasks")
    language = models.CharField(max_length=50, blank=True, null=True)
    starter_code = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.language if self.language else 'No Language'}"

