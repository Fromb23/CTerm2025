# serializers.py
from rest_framework import serializers
from user.models.course_model import Module, Course, Sprint


class SprintInfoSerializer(serializers.ModelSerializer):
    """Nested serializer for sprint information in module responses"""
    class Meta:
        model = Sprint
        fields = ['id', 'name', 'start_date']


class ModuleSerializer(serializers.ModelSerializer):
    sprint_id = serializers.IntegerField(write_only=True)
    sprint = SprintInfoSerializer(read_only=True)
    
    class Meta:
        model = Module
        fields = [
            'id', 'name', 'description', 'order_index', 'start_date', 
            'end_date', 'status', 'sprint_id', 'sprint', 'is_active',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'description': {'default': ''},
            'order_index': {'default': 0},
            'status': {'default': 'draft'},
            'is_active': {'default': True},
        }

    def validate(self, attrs):
        """Custom validation for module creation/update"""
        course_pk = self.context.get('course_pk')
        sprint_id = attrs.get('sprint_id')
        
        if not course_pk:
            raise serializers.ValidationError("Course ID is required")
            
        # Check if course exists
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            raise serializers.ValidationError("Course not found")
        
        # Validate sprint_id if provided (required for creation)
        if sprint_id:
            try:
                sprint = Sprint.objects.get(id=sprint_id, course=course)
            except Sprint.DoesNotExist:
                raise serializers.ValidationError("Sprint not found for this course")
            
            # Check module name uniqueness within sprint
            name = attrs.get('name')
            if name:
                # For creation
                if not self.instance:
                    if Module.objects.filter(sprint=sprint, name=name).exists():
                        raise serializers.ValidationError(
                            "Module name already exists for this sprint"
                        )
                # For updates
                else:
                    if Module.objects.filter(
                        sprint=sprint, 
                        name=name
                    ).exclude(pk=self.instance.pk).exists():
                        raise serializers.ValidationError(
                            "Module name already exists for this sprint"
                        )
        
        return attrs

    def create(self, validated_data):
        """Create module with sprint relationship"""
        course_pk = self.context.get('course_pk')
        sprint_id = validated_data.pop('sprint_id')
        
        # Get the sprint
        course = Course.objects.get(pk=course_pk)
        sprint = Sprint.objects.get(id=sprint_id, course=course)
        
        # Create module
        module = Module.objects.create(sprint=sprint, **validated_data)
        return module

    def update(self, instance, validated_data):
        """Update module, optionally changing sprint"""
        sprint_id = validated_data.pop('sprint_id', None)
        
        # If sprint_id is provided, validate and update sprint
        if sprint_id:
            course_pk = self.context.get('course_pk')
            course = Course.objects.get(pk=course_pk)
            try:
                sprint = Sprint.objects.get(id=sprint_id, course=course)
                instance.sprint = sprint
            except Sprint.DoesNotExist:
                raise serializers.ValidationError("Sprint not found for this course")
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class ModuleListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing modules"""
    sprint_id = serializers.IntegerField(source='sprint.id', read_only=True)
    
    class Meta:
        model = Module
        fields = [
            'id', 'name', 'description', 'order_index', 'start_date', 
            'end_date', 'status', 'sprint_id', 'is_active'
        ]