from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, FoodViewSet, UserViewSet, ReviewViewSet

r = DefaultRouter()
r.register('categories', CategoryViewSet, basename='category')
r.register('foods', FoodViewSet, basename='food')
r.register('users', UserViewSet, basename='user')
r.register('reviews', ReviewViewSet, basename='review')


urlpatterns = [
    path('',include(r.urls)),
]