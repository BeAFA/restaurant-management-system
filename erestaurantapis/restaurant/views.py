from django.db import transaction
from django.utils import timezone
from pyexpat.errors import messages
from rest_framework import viewsets, generics, filters, status, permissions, parsers
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from datetime import timedelta

from . import perms
from .serializers import CategorySerializer, FoodSerializer, ReviewSerializer, FoodDetailSerializer, UserSerializer, \
    UserAnonymousSerializer, OrderSerializer, OrderDetailSerializer, ReservationSerializer, ChefApproveSerializer
from .models import Category, Food, User, Review, Order, Reservation, OrderDetail, UserRole
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
        if self.action == ['retrieve', 'list', 'get_review'] and self.request.method == permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        if self.action in ['get_reviews'] and self.request.method.__eq__('POST'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['GET', 'POST'], url_path='reviews', detail=True)
    def get_reviews(self, request, pk):
        if self.request.method.__eq__('POST'):
            s = ReviewSerializer(data={
                'comment': request.data.get('comment'),
                'rating': request.data.get('rating'),
                'food': self.get_object().pk
            })
            s.is_valid(raise_exception=True)
            s.save(user=request.user)

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

    @action(methods=['GET', 'PATCH'], url_path='current_user', detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def current_user(self, request):
        u = request.user
        if request.method.__eq__('PATCH'):
            s = UserAnonymousSerializer(u, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            u = s.save()

        return Response(UserSerializer(u).data, status=status.HTTP_200_OK)

    @action(methods=['GET'], url_path='pending_chefs', detail=False, permission_classes=[perms.IsAdminRole])
    def pending_chefs(self, request):
        pending = User.objects.filter(is_active=True, user_role=UserRole.CHEF, is_approved=False)

        return Response(UserSerializer(pending, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['PATCH'], url_path='approve', detail=True, permission_classes=[perms.IsAdminRole])
    def approve_chef(self, request, pk):
        chef = get_object_or_404(User, pk=pk, user_role=UserRole.CHEF)

        serializer = ChefApproveSerializer(chef, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        action = "đã duyệt" if chef.is_approved == True else "từ chối"

        return Response({
            'messages': f'Đã {action} tài khoản đầu bếp {chef.first_name + " " + chef.last_name}',
            'user': ChefApproveSerializer(chef).data
        }, status=status.HTTP_200_OK)


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


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Order.objects.filter(active=True).select_related('user').prefetch_related('details')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, perms.OrderOwner]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return self.queryset.none()

        query = self.queryset.filter(user=self.request.user)
        status_order = self.request.query_params.get('status_order')
        if status_order:
            query = query.filter(status_order=status_order)

        return query

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['GET'], url_path='current_order', detail=False)
    def current_order(self, request):
        order = Order.objects.filter(user=request.user, status_order=Order.status_order.WAITING).first()
        if not order:
            return Response({'message': 'Không có order nào đang chờ cả'}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

    @transaction.atomic
    def partial_update(self, request, pk=None):
        order = self.get_object()
        if order.status_order != Order.status_order.WAITING:
            return Response(
                {'error': 'Bạn không có order nào có thể chỉnh sửa được cả'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OrderSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    @action(methods=['DELETE'], detail=True)
    def cancel(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)

        if order.status_order != Order.status_order.WAITING:
            return Response({'error': 'Bạn không thể hủy order này'}, status=status.HTTP_400_BAD_REQUEST)

        order.status_order = Order.status_order.CANCELED
        order.active = False
        order.save()

        return Response({'message': 'Đã hủy order'}, status=status.HTTP_200_OK)


class ReservationViewSet(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView):
    serializer_class = ReservationSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    search_fields = ('user__first_name', 'user__last_name', 'table__id')
    ordering_fields = ['table__id']
    permission_classes = [permissions.IsAuthenticated, perms.ReservationOwner]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Reservation.objects.none()

        return Reservation.objects.filter(user=user, active=True).select_related('user')

    def _get_upcoming_reservation(self, user):
        return Reservation.objects.filter(
            user=user,
            active=True,
            end_time__gte=timezone.now()
        ).order_by('serve_time').first()

    @action(methods=['GET', 'POST', 'PATCH'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def current_reservation(self, request):
        # POST: tạo mới — không cần reservation hiện tại
        if request.method == 'POST':
            return self._create_reservation(request)

        # GET / PATCH: cần tìm reservation sắp tới
        reservation = self._get_upcoming_reservation(request.user)
        if not reservation:
            return Response(
                {'message': 'Bạn không có đặt bàn nào sắp tới'},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == 'PATCH':
            return self._update_reservation(request, reservation)

            # GET
        return Response(
            ReservationSerializer(reservation).data,
            status=status.HTTP_200_OK
        )

    @transaction.atomic
    def _create_reservation(self, request):
        serializer = ReservationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reservation = serializer.save(user=request.user)
        return Response(
            ReservationSerializer(reservation).data,
            status=status.HTTP_201_CREATED
        )

    @transaction.atomic
    def _update_reservation(self, request, reservation):
        if reservation.serve_time <= timezone.now():
            return Response(
                {'error': 'Không thể sửa đặt bàn đã bắt đầu'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReservationSerializer(
            reservation, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        # Nếu serve_time thay đổi, reset end_time để tự tính lại
        if 'serve_time' in request.data:
            serializer.validated_data['end_time'] = None

        updated_reservation = serializer.save()
        return Response(
            ReservationSerializer(updated_reservation).data,
            status=status.HTTP_200_OK
        )

    @transaction.atomic
    def perform_destroy(self, instance):
        if instance.serve_time <= timezone.now():
            raise ValidationError('Không thể hủy đặt bàn đã bắt đầu')
        instance.active = False
        instance.save()
