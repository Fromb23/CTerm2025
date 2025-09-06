import jwt
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model

User = get_user_model()

EXEMPT_PATHS = [
    "/api/auth/login/",
    "/api/token/refresh/",
    # "/api/users/roles/create/",
    # "/api/users/admins/",
]

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.rstrip("/") in [p.rstrip("/") for p in EXEMPT_PATHS]:
            request.META.pop("HTTP_AUTHORIZATION", None)
            return

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse(
                {"error": "Authentication credentials were not provided"},
                status=401
            )

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"]
            )
            user = User.objects.get(id=payload["user_id"])
            request.user = user
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=401)
