from rest_framework.permissions import DjangoModelPermissions, BasePermission

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        elif request.method == "GET":
            return True
        else:
            return obj.user == request.user


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        else:
            return obj.client.user_account == request.user


