from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(["GET"])
def api_status(request):
    return Response({"status": "API is healthy"})

@api_view(["GET"])
def fetch_logs(request):
    # Stub logic; later can hook into real log files or database
    return Response({"logs": ["Log entry 1", "Log entry 2"]})
