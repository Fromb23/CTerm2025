from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from user.models import Role, CustomUser


def create_admin_view(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

    email = request.POST.get("email")
    full_name = request.POST.get("full_name")
    role_id = request.POST.get("role_id")
    password = request.POST.get("password")
    assigned_by = request.user if request.user.is_authenticated else None

    try:
        role = Role.objects.get(id=role_id)
    except Role.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Role not found"}, status=400)

    user = CustomUser.objects.create_admin(
        email=email,
        full_name=full_name,
        role=role,
        password=password,
        assigned_by=assigned_by
    )
    return JsonResponse({"status": "success", "user_id": str(user.id)})


def list_admins_view(request):
    admins = CustomUser.objects.filter(role__name="Admin")
    data = [
        {
            "id": str(admin.id),
            "email": admin.email,
            "full_name": admin.full_name,
            "role": admin.role.name if admin.role else None,
            "assigned_by": admin.assigned_by.full_name if admin.assigned_by else None,
        }
        for admin in admins
    ]
    return JsonResponse(data, safe=False)


from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods

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