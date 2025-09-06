from rest_framework import serializers
from user.models.role_models import Role

class RoleSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=100,
        required=True,
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True
    )
    permissions = serializers.DictField(
        child=serializers.BooleanField(),
        required=True,
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions']

    def update(self, instance, validated_data):
        """
        Override update to allow partial updates without enforcing required fields.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
