import logging
from django.http import JsonResponse

logger = logging.getLogger(__name__)

class GlobalExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            return self.get_response(request)
        except Exception as e:
            logger.exception("Unhandled Exception: %s", e)
            return JsonResponse(
                {"error": "An unexpected error occurred. Please contact support."},
                status=500
            )