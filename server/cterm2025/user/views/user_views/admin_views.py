import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.http import JsonResponse
from user.models.user_models import CustomUser, AdminProfile
from user.models.role_models import Role

@api_view(["POST"])
@permission_classes([AllowAny])
@transaction.atomic
def create_admin_view(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

    email = data.get("email")
    existing_user = CustomUser.objects.filter(email=email).first()
    if existing_user:
        return JsonResponse({"status": "error", "message": "User with this email already exists"}, status=400)

    valid_fields = ["email", "full_name", "role_name", "password"]
    invalid_fields = [key for key in data if key not in valid_fields]
    if invalid_fields:
        return JsonResponse({"status": "error", "message": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

    full_name = data.get("full_name")
    role_name = data.get("role_name")
    password = data.get("password")
    assigned_by = request.user if request.user.is_authenticated else None

    if not role_name:
        return JsonResponse({"status": "error", "message": "Role name is required"}, status=400)

    try:
        role = Role.objects.get(name__iexact=role_name)
    except Role.DoesNotExist:
        return JsonResponse({"status": "error", "message": f"Role '{role_name}' not found"}, status=400)

    user = CustomUser.objects.create_admin(
        email=email,
        full_name=full_name,
        role=role,
        password=password,
        assigned_by=assigned_by
    )

    admin_profile = AdminProfile.objects.get(user=user)

    return JsonResponse({
        "status": "success",
        "data": {
            "admin_id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": admin_profile.role.name if admin_profile.role else None,
        }
    }, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_admins_view(request):
    admins = AdminProfile.objects.select_related("user", "role").all()
    if not admins:
        return JsonResponse({"status": "error", "message": "No admins found"}, status=404)
    data = []
    for admin in admins:
        data.append({
            "admin_id": str(admin.user.id),
            "email": admin.user.email,
            "full_name": admin.user.full_name,
            "role": admin.role.name,
            "assigned_at": admin.created_at.isoformat()
        })
    return JsonResponse({"status": "success", "data": data}, status=200)


@transaction.atomic
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_admin_view(request, admin_id):
    try:
        if not admin_id:
            return JsonResponse({"status": "error", "message": "Admin ID is required"}, status=400)
        admin_profile = AdminProfile.objects.select_related("user", "role").get(user__id=admin_id)
        data = {
            "admin_id": str(admin_profile.user.id),
            "email": admin_profile.user.email,
            "full_name": admin_profile.user.full_name,
            "role": admin_profile.role.name if admin_profile.role else None,
            "assigned_at": admin_profile.created_at.isoformat()
        }
        return JsonResponse({"status": "success", "data": data}, status=200)
    except AdminProfile.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Admin not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@transaction.atomic
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_admin_view(request, admin_id):
    try:
        admin_profile = AdminProfile.objects.select_related("user", "role").get(user__id=admin_id)
    except AdminProfile.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Admin not found"}, status=404)

    data = json.loads(request.body or "{}")

    user_fields = {"email", "full_name", "password"}
    admin_fields = {"role_name"}
    valid_fields = user_fields.union(admin_fields)
    invalid_fields = [key for key in data if key not in valid_fields]
    if invalid_fields:
        return JsonResponse({"status": "error", "message": f"Invalid fields: {', '.join(invalid_fields)}"}, status=400)

    for field in user_fields:
        if field in data:
            if field == "password":
                admin_profile.user.set_password(data[field])
            else:
                setattr(admin_profile.user, field, data[field])
    admin_profile.user.save()

    if "role_name" in data:
        try:
            role = Role.objects.get(name__iexact=data["role_name"])
            admin_profile.role = role
        except Role.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Role not found"}, status=400)
    admin_profile.save()

    return JsonResponse({
        "status": "success",
        "data": {
            "admin_id": str(admin_profile.user.id),
            "email": admin_profile.user.email,
            "full_name": admin_profile.user.full_name,
            "role": admin_profile.role.name if admin_profile.role else None,
        }
    }, status=200)


@transaction.atomic
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_admin_view(request, admin_id):
    print( admin_id )
    if not admin_id:
        return JsonResponse({"status": "error", "message": "Admin ID is required"}, status=400)

    try:
        user = CustomUser.objects.get(id=admin_id, user_type="admin")
        user.delete()
        return JsonResponse({"status": "success", "message": "Admin deleted successfully"}, status=200)

    except CustomUser.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Admin not found"}, status=404)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
