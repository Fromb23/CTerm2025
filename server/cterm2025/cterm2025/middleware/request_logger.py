import time
import logging

logger = logging.getLogger("request_logger")

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        method = request.method
        path = request.get_full_path()
        user = getattr(request, 'user', None)
        user_info = f"user={user.email}" if user and user.is_authenticated else "anonymous"

        logger.info(f"Incoming request: {method} {path} {user_info}")

        response = self.get_response(request)


        duration = time.time() - start_time
        status_code = response.status_code

        logger.info(f"Outgoing response: {method} {path} {status_code} completed_in={duration:.3f}s {user_info}")

        return response