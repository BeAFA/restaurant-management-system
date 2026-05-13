from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, FoodViewSet
r = DefaultRouter()
r.register('categories', CategoryViewSet, basename='category')
r.register('foods', FoodViewSet, basename='food')

urlpatterns = [
    path('',include(r.urls)),
]