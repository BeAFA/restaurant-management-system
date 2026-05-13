from rest_framework import viewsets, generics, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import CategorySerializer, FoodSerializer
from .models import Category, Food
from .paginators import FoodPagination

class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Category.objects.prefetch_related('foods')
    serializer_class = CategorySerializer

    @action(methods=['GET'], url_path='foods', detail=True)
    def get_foods(self, request, pk):
        foods = self.get_object().foods.filter(active=True)
        return Response(FoodSerializer(foods, many=True).data, status=status.HTTP_200_OK)

class FoodViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Food.objects.filter(active=True)
    serializer_class = FoodSerializer
    pagination_class = FoodPagination
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ['dish']
    ordering_fields = ['id', 'price']

    def get_queryset(self):
        query = self.queryset

        q = self.request.query_params.get('q')

        if q:
            query = query.filter(dish__icontains=q)
        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        return query