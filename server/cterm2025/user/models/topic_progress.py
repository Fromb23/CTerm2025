import uuid
from django.db import models
from django.utils import timezone

class TopicProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('user.CustomUser', on_delete=models.CASCADE)
    topic = models.ForeignKey('course.Topic', on_delete=models.CASCADE)
    is_unlocked = models.BooleanField(default=False)
    unlocked_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    progress_score = models.FloatField(null=True, blank=True)
    quiz_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'topic')
        ordering = ['-updated_at']

    def __str__(self):
        return f"Progress of {self.user} on {self.topic}"
