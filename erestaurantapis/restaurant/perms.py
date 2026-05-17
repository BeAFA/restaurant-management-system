from rest_framework import permissions

from restaurant.models import UserRole


class ReviewOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, review):
        return super().has_permission(request, view) and request.user == review.user

class OrderOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, order):
        return super().has_permission(request, view) and request.user == order.user

class ReservationOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, reservation):
        return super().has_permission(request, view) and request.user == reservation.user

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.user_role == UserRole.ADMIN
        )

class IsApprovedChef(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.user_role == UserRole.CHEF and request.user.is_approved
        )