from rest_framework import viewsets, generics, filters, status, permissions, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from . import perms
from .serializers import CategorySerializer, FoodSerializer, ReviewSerializer, FoodDetailSerializer, UserSerializer, \
    UserAnonymousSerializer, OrderSerializer, OrderDetailSerializer
from .models import Category, Food, User, Review, Order
from .paginators import FoodPagination, ReviewsPagination


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

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FoodDetailSerializer

        return FoodSerializer

    def get_queryset(self):
        query = self.queryset

        q = self.request.query_params.get('q')

        if q:
            query = query.filter(dish__icontains=q)
        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        return query

    def get_permissions(self):
        if self.action in ['get_reviews'] and self.request.method.__eq__('POST'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['GET', 'POST'], url_path='reviews', detail=True)
    def get_reviews(self, request, pk):
        if self.request.method.__eq__('POST'):
            s = ReviewSerializer(data={
                'comment': request.data.get('comment'),
                'rating': request.data.get('rating'),
                'user': request.user.pk,
                'food': self.get_object().pk
            })
            s.is_valid(raise_exception=True)
            s.save()

            return Response(s.data, status=status.HTTP_201_CREATED)

        comments = self.get_object().reviews.select_related('user').filter(active=True)

        p = ReviewsPagination()
        page = p.paginate_queryset(comments, self.request)
        if page is not None:
            serializer = ReviewSerializer(page, many=True)

            return p.get_paginated_response(serializer.data)

        return Response(ReviewSerializer(comments, many=True).data, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser]

    @action(methods=['GET', 'PATCH'], url_path='current-user', detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def current_user(self, request):
        u = request.user
        if request.method.__eq__('PATCH'):
            s = UserAnonymousSerializer(u, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            u = s.save()

        return Response(UserSerializer(u).data, status=status.HTTP_200_OK)


class ReviewViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Review.objects.filter(active=True)
    serializer_class = ReviewSerializer
    permission_classes = [perms.ReviewOwner]

    @action(methods=['PATCH'], detail=False)
    def current_review(self, request, pk):
        review = Review.objects.get(pk=pk)
        if request.method.__eq__('PATCH'):
            s = ReviewSerializer(review, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            review = s.save()

        return Response(ReviewSerializer(review).data, status=status.HTTP_200_OK)

class OrderViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Order.objects.filter(active=True).select_related('user')
    serializer_class = OrderSerializer
    permission_classes = [perms.OrderOwner]

    @action(methods=['GET'], url_path='user-orders', detail=False)
    def order(self, request):
        orders = Order.objects.filter(user=request.user)
        return Response(orders, status=status.HTTP_200_OK)

    @action(methods=['POST'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def current_order(self, request,pk):
        order = Order.objects.get(pk=pk)
        if request.method.__eq__('POST'):
            s = OrderSerializer(order,data={
                ''
            })
            s.is_valid(raise_exception=True)
            order = s.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


    @action(methods=['PATCH'], detail=False)
    def update_order(self, request, pk):
        current_order = Order.objects.filter(status=Order.status_order.WAITING).get(pk=pk)
        if current_order and request.method.__eq__('PATCH'):
            s = OrderSerializer(current_order, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            current_order = s.save()
        return Response(OrderSerializer(current_order).data, status=status.HTTP_200_OK)