from rest_framework import permissions


class ReviewOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, review):
        return super().has_permission(request, view) and request.user == review.user

class OrderOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, order):
        return super().has_permission(request, view) and request.user == order.user