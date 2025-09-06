from django.db import models


class UserType(models.TextChoices):
    STUDENT = 'student', 'Student'
    ADMIN = 'admin', 'Admin'


class Role(models.Model):
    """
    Role model for admin users with specific permissions.
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=dict)

    class Meta:
        ordering = ['name']
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.name

