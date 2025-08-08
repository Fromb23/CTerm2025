from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from user.models import Role


@csrf_exempt
@require_http_methods(["POST"])
def create_role_view(request):
    """
    Create a new role with optional permissions.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        name = data.get("name")
        description = data.get("description", "")
        permissions = data.get("permissions", {})

        if not name:
            return JsonResponse({"status": "error", "message": "Role name is required"}, status=400)

        if Role.objects.filter(name=name).exists():
            return JsonResponse({"status": "error", "message": "Role already exists"}, status=400)

        role = Role.objects.create(
            name=name,
            description=description,
            permissions=permissions
        )

        return JsonResponse({"status": "success", "role_id": str(role.id)})
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)


@require_http_methods(["GET"])
def list_roles_view(request):
    """
    List all roles.
    """
    roles = Role.objects.all().values("id", "name", "description", "permissions")
    return JsonResponse({"status": "success", "roles": list(roles)})


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def update_role_view(request, role_id):
    """
    Update role details.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        try:
            role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Role not found"}, status=404)

        role.name = data.get("name", role.name)
        role.description = data.get("description", role.description)
        role.permissions = data.get("permissions", role.permissions)

        role.save()
        return JsonResponse({"status": "success", "message": "Role updated"})
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_role_view(request, role_id):
    """
    Delete a role.
    """
    try:
        role = Role.objects.get(id=role_id)
        role.delete()
        return JsonResponse({"status": "success", "message": "Role deleted"})
    except Role.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Role not found"}, status=404)
