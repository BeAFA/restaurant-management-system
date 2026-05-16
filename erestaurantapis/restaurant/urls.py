from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, FoodViewSet, UserViewSet, ReviewViewSet, OrderViewSet

r = DefaultRouter()
r.register('categories', CategoryViewSet, basename='category')
r.register('foods', FoodViewSet, basename='food')
r.register('users', UserViewSet, basename='user')
r.register('reviews', ReviewViewSet, basename='review')
r.register('orders', OrderViewSet, basename='order')


urlpatterns = [
    path('',include(r.urls)),
]