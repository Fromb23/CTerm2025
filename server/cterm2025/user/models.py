# core/models.py
import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models, transaction
from django.utils import timezone
from django.core.validators import MinLengthValidator


class UserType(models.TextChoices):
    STUDENT = 'student', 'Student'
    ADMIN = 'admin', 'Admin'


class Role(models.Model):
    """
    Role model for admin users with specific permissions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=dict)  # Expected: { "can_create": True, "can_edit": False }

    class Meta:
        ordering = ['name']
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.name


class CustomUserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        if not full_name or len(full_name.strip()) < 2:
            raise ValueError("Users must have a valid full name")

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            full_name=full_name.strip(),
            **extra_fields
        )
        if not password:
            raise ValueError("Password is required")
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_admin(self, email, full_name, role, password=None, assigned_by=None, **extra_fields):
        """
        Creates an admin user with an assigned role and profile.
        """
        if not role:
            raise ValueError("Admin must be assigned a role")

        extra_fields.setdefault('user_type', UserType.ADMIN)

        with transaction.atomic():
            user = self.create_user(email, full_name, password, **extra_fields)

            if not isinstance(role, Role):
                role = Role.objects.get(pk=role)

            admin_profile = AdminProfile.objects.create(user=user, role=role)

            AdminRoleHistory.objects.create(
                user=user,
                role=role,
                start_date=timezone.now().date(),
                assigned_by=assigned_by
            )

        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, validators=[MinLengthValidator(2)])
    profile_picture_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True)
    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.STUDENT
    )

    last_login_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.email})"

    def save(self, *args, **kwargs):
        self.full_name = self.full_name.strip()
        super().save(*args, **kwargs)


class StudentProfile(models.Model):
    """
    Extended profile information for students.
    """
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='student_profile'
    )
    current_level = models.CharField(max_length=50, blank=True)
    education_background = models.TextField(blank=True)
    career_goals = models.TextField(blank=True)
    skills = models.TextField(blank=True)
    preferred_timezone = models.CharField(max_length=50, blank=True)
    preferred_language = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'

    def __str__(self):
        return f"Student Profile: {self.user.full_name}"


class AdminProfile(models.Model):
    """
    Extended profile information for admin users.
    """
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='admin_profile'
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='admins'
    )
    custom_permissions = models.JSONField(default=dict)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Admin Profile'
        verbose_name_plural = 'Admin Profiles'

    def __str__(self):
        return f"Admin Profile: {self.user.full_name}"

    def set_role(self, new_role, assigned_by=None, notes=""):
        """
        Updates role and logs it in AdminRoleHistory.
        """
        if not isinstance(new_role, Role):
            new_role = Role.objects.get(pk=new_role)

        self.role = new_role
        self.save()

        AdminRoleHistory.objects.create(
            user=self.user,
            role=new_role,
            start_date=timezone.now().date(),
            assigned_by=assigned_by,
            notes=notes
        )


class AdminRoleHistory(models.Model):
    """
    Tracks role assignment history for admin users.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='role_history'
    )
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    assigned_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_roles'
    )
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Admin Role History'
        verbose_name_plural = 'Admin Role Histories'
        ordering = ['-start_date']

    def __str__(self):
        status = "Current" if self.end_date is None else "Past"
        return f"{status} role: {self.user.full_name} - {self.role.name}"