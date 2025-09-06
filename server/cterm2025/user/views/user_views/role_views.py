from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from user.models.role_models import Role


@api_view(["POST"])
@permission_classes([IsAuthenticated])
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

        return JsonResponse({"status": "success", "role": {
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "permissions": role.permissions
        }}, status=201
        )
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_roles_view(request):
    """
    List all roles.
    """
    try:
        roles = Role.objects.all().values("id", "name", "description", "permissions")
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "success", "roles": list(roles)}, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_role_view(request, role_id):
    """
    Retrieve a specific role by ID.
    """
    try:
        if not role_id:
            return JsonResponse({"status": "error", "message": "Role ID is required"}, status=400)
        role = Role.objects.get(id=role_id)
        role_data = {
            "id": str(role.id),
            "name": role.name,
            "description": role.description,
            "permissions": role.permissions
        }
        return JsonResponse({"status": "success", "role": role_data}, status=200)
    except Role.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Role not found"}, status=404)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_role_view(request, role_id):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

    try:
        role = Role.objects.get(id=role_id)
    except Role.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Role not found"}, status=404)

    role.name = data.get("name", role.name).strip()
    role.description = data.get("description", role.description)
    permissions = data.get("permissions", role.permissions)

    if not isinstance(permissions, dict):
        return JsonResponse({"status": "error", "message": "Invalid permissions format, must be JSON object"}, status=400)

    role.permissions = permissions
    role.save()

    return JsonResponse({"status": "success", "role": {
        "id": str(role.id),
        "name": role.name,
        "description": role.description,
        "permissions": role.permissions
    }}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_role_view(request, role_id):
    """
    Delete a role.
    """
    try:
        if not role_id:
            return JsonResponse({"status": "error", "message": "Role ID is required"}, status=400)
        role = Role.objects.get(id=role_id)
        role.delete()
        return JsonResponse({"status": "success", "message": "Role deleted successfully"}, status=200)
    except Role.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Role not found"}, status=404)
