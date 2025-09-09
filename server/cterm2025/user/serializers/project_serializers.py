from rest_framework import serializers
from user.models.course_model import Project, Sprint
from user.serializers.task_serializers import serialize_task


class ProjectSerializer(serializers.ModelSerializer):
    sprint_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    tasks = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'is_active', 'sprint_id', 'tasks']
        extra_kwargs = {
            'start_date': {'required': True},
            'name': {'required': True},
        }
    
    def get_tasks(self, obj):
        """Serialize tasks using the existing serialize_task utility."""
        return [serialize_task(task) for task in obj.tasks.all()]
    
    def validate_name(self, value):
        """Validate that project name is unique, excluding current instance on update."""
        if self.instance:
            # Update case - exclude current instance from uniqueness check
            if Project.objects.filter(name=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Project with this name already exists.")
        else:
            # Create case - check if name exists
            if Project.objects.filter(name=value).exists():
                raise serializers.ValidationError("Project with this name already exists.")
        return value
    
    def validate_sprint_id(self, value):
        """Validate that sprint exists if sprint_id is provided."""
        if value is not None:
            if not Sprint.objects.filter(id=value).exists():
                raise serializers.ValidationError("Sprint not found.")
        return value
    
    def create(self, validated_data):
        """Create project with sprint relationship."""
        sprint_id = validated_data.pop('sprint_id', None)
        sprint = None
        
        if sprint_id:
            sprint = Sprint.objects.get(id=sprint_id)
        
        project = Project.objects.create(sprint=sprint, **validated_data)
        return project
    
    def update(self, instance, validated_data):
        """Update project with sprint relationship."""
        sprint_id = validated_data.pop('sprint_id', None)
        
        if 'sprint_id' in self.initial_data:  # Check if sprint_id was provided in request
            if sprint_id is None:
                instance.sprint = None
            else:
                instance.sprint = Sprint.objects.get(id=sprint_id)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    
    def to_representation(self, instance):
        """Customize the serialized output."""
        representation = super().to_representation(instance)
        representation['sprint_id'] = instance.sprint.id if instance.sprint else None
        return representation


class ProjectCreateSerializer(ProjectSerializer):
    """Serializer specifically for project creation with required sprint_id."""
    sprint_id = serializers.IntegerField(required=True)
    
    class Meta(ProjectSerializer.Meta):
        extra_kwargs = {
            'start_date': {'required': True},
            'name': {'required': True},
        }