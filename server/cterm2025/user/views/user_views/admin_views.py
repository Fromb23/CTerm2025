import json
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.http import JsonResponse
from user.models.user_models import CustomUser, AdminProfile
from user.models.role_models import Role
from django.views.decorators.http import require_http_methods

@csrf_exempt
@transaction.atomic
@require_http_methods(["POST"])
def create_admin_view(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

    email = data.get("email")
    full_name = data.get("full_name")
    role_name = data.get("role_name")
    password = data.get("password")
    assigned_by = request.user if request.user.is_authenticated else None

    if not role_name:
        return JsonResponse({"status": "error", "message": "Role name is required"}, status=400)

    try:
        role = Role.objects.get(name__iexact=role_name)  # case-insensitive match
    except Role.DoesNotExist:
        return JsonResponse({"status": "error", "message": f"Role '{role_name}' not found"}, status=400)

    user = CustomUser.objects.create_admin(
        email=email,
        full_name=full_name,
        role=role,
        password=password,
        assigned_by=assigned_by
    )

    return JsonResponse({
        "status": "success",
        "user_id": str(user.id),
        "role": role.name
    })

@require_http_methods(["GET"])
def list_admins_view(request):
    admins = AdminProfile.objects.select_related("user", "role").all()
    data = []
    for admin in admins:
        data.append({
            "admin_id": str(admin.user.id),
            "email": admin.user.email,
            "full_name": admin.user.full_name,
            "role": admin.role.name,
            "assigned_at": admin.created_at.isoformat()
        })
    return JsonResponse(data, safe=False)

@require_http_methods(["PUT", "PATCH"])
def update_admin_view(request, admin_id):
    try:
        admin = CustomUser.objects.get(id=admin_id, role__name="Admin")
    except CustomUser.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Admin not found"}, status=404)

    email = request.POST.get("email", admin.email)
    full_name = request.POST.get("full_name", admin.full_name)

    role_id = request.POST.get("role_id")
    if role_id:
        try:
            role = Role.objects.get(id=role_id)
            admin.role = role
        except Role.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Role not found"}, status=400)

    password = request.POST.get("password")
    if password:
        admin.set_password(password)

    admin.email = email
    admin.full_name = full_name.strip()

    admin.save()

    return JsonResponse({"status": "success", "message": "Admin updated successfully"})


def delete_admin_view(request, admin_id):
    if request.method == "DELETE":
        admin = get_object_or_404(CustomUser, id=admin_id, role__name="Admin")
        admin.delete()
        return JsonResponse({"status": "success", "message": "Admin deleted successfully"})
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)