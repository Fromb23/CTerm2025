# serializers.py
from rest_framework import serializers
from user.models.course_model import Sprint, Course


class SprintSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(read_only=True, source='course.id')
    
    class Meta:
        model = Sprint
        fields = [
            'id', 'name', 'duration', 'start_date', 'description', 
            'course_id', 'is_active'
        ]
        extra_kwargs = {
            'duration': {'default': 0},
            'description': {'default': ''},
            'is_active': {'default': True},
        }

    def validate_start_date(self, value):
        """Ensure start_date is provided and valid"""
        if not value:
            raise serializers.ValidationError("start_date is required")
        return value

    def validate(self, attrs):
        """Custom validation for sprint name uniqueness within course"""
        course_pk = self.context.get('course_pk')
        if not course_pk:
            raise serializers.ValidationError("Course ID is required")
            
        # Check if course exists
        try:
            course = Course.objects.get(pk=course_pk)
        except Course.DoesNotExist:
            raise serializers.ValidationError("Course not found")
        
        name = attrs.get('name')
        if name:
            # For creation
            if not self.instance:
                if Sprint.objects.filter(name=name, course_id=course_pk).exists():
                    raise serializers.ValidationError(
                        "Sprint with this name already exists for this particular course"
                    )
            # For updates
            else:
                if Sprint.objects.filter(
                    name=name, 
                    course_id=course_pk
                ).exclude(pk=self.instance.pk).exists():
                    raise serializers.ValidationError(
                        "Sprint with this name already exists for this particular course"
                    )
        
        return attrs