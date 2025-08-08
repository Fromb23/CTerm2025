from django.http import JsonResponse

def custom_bad_request(request, exception):
    return JsonResponse({"error": "Bad request (400)."}, status=400)

def custom_permission_denied(request, exception):
    return JsonResponse({"error": "Permission denied (403)."}, status=403)

def custom_page_not_found(request, exception):
    return JsonResponse({"error": "Page not found (404)."}, status=404)

def custom_server_error(request):
    return JsonResponse({"error": "Internal server error (500)."}, status=500)