from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import AdminProfile
from user.serializers.auth_serializer import LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        user_type = data["user"]["user_type"].upper()
        user = serializer.user 
        if user_type == "ADMIN":
            return self.handle_admin_login(user, data)
        elif user_type == "STUDENT":
            return self.handle_student_login(user, data)
        return Response({"detail": "Unauthorized user"}, status=status.HTTP_403_FORBIDDEN)

    def _generate_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

    def handle_admin_login(self, user, data):
        user_id = data["user"]["id"]

        try:
            profile = AdminProfile.objects.get(user_id=user_id)
        except AdminProfile.DoesNotExist:
            return Response({"detail": "Admin profile not found"}, status=status.HTTP_404_NOT_FOUND)

        if not profile.role:
            return Response({"detail": "Admin has no role assigned"}, status=status.HTTP_403_FORBIDDEN)

        tokens = self._generate_tokens(user)

        role_name = profile.role.name
        permissions = profile.role.permissions or {}

        data["user"]["role"] = role_name
        data["user"]["permissions"] = permissions
        data["tokens"] = tokens
        data["message"] = "Admin login successful"

        return Response(data, status=status.HTTP_200_OK)

    def handle_student_login(self, user, data):
        tokens = self._generate_tokens(user)

        data["tokens"] = tokens
        data["message"] = "Student login successful"
        return Response(data, status=status.HTTP_200_OK)

    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        user_type = data["user"]["user_type"].upper()
        user = request.user or None
        if user_type == "ADMIN":
            return self.handle_admin_login(data)
        elif user_type == "STUDENT":
            return self.handle_student_login(data)
        return Response({"detail": "Unauthorized user"}, status=status.HTTP_403_FORBIDDEN)

    def handle_admin_login(self, data):
        """Enrich admin login response with role + permissions from Role JSONField."""
        user_id = data["user"]["id"]

        try:
            profile = AdminProfile.objects.get(user_id=user_id)
        except AdminProfile.DoesNotExist:
            return Response({"detail": "Admin profile not found"}, status=status.HTTP_404_NOT_FOUND)

        if not profile.role:
            return Response({"detail": "Admin has no role assigned"}, status=status.HTTP_403_FORBIDDEN)

        role_name = profile.role.name
        permissions = profile.role.permissions or {}

        data["user"]["role"] = role_name
        data["user"]["permissions"] = permissions
        data["message"] = "Admin login successful"

        return Response(data, status=status.HTTP_200_OK)

    def handle_student_login(self, data):
        """Enrich student login response with profile info if needed."""
        data["message"] = "Student login successful"
        return Response(data, status=status.HTTP_200_OK)