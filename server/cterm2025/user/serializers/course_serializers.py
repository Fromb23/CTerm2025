from rest_framework import serializers
from user.models.course_model import Course
from user.utils.code_generator import generate_course_code


class CourseSerializer(serializers.ModelSerializer):
    course_code = serializers.CharField(read_only=True)
    estimated_duration = serializers.IntegerField(source='duration', required=False)
    
    class Meta:
        model = Course
        fields = [
            'id', 'name', 'course_code', 'description', 'mode_of_learning',
            'commitment_time', 'estimated_duration', 'requirements',
            'frequently_asked_questions', 'start_date', 'is_published'
        ]
        extra_kwargs = {
            'mode_of_learning': {'default': 'online'},
            'commitment_time': {'default': 0},
            'frequently_asked_questions': {'default': ''},
            'is_published': {'default': False},
            'estimated_duration': {'default': 0},
            'requirements': {'default': ''},
        }

    def validate_name(self, value):
        """Ensure course name is unique"""
        if self.instance:
            # For updates, exclude current instance
            if Course.objects.filter(name=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Course with this name already exists")
        else:
            # For creation
            if Course.objects.filter(name=value).exists():
                raise serializers.ValidationError("Course with this name already exists")
        return value

    def create(self, validated_data):
        """Auto-generate course code on creation"""
        validated_data['course_code'] = generate_course_code(validated_data['name'])
        return super().create(validated_data)