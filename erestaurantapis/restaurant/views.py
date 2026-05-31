from django.db import transaction
from django.db.models import Avg, Count, Sum
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import viewsets, generics, filters, status, permissions, parsers, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from datetime import timedelta
from django.db.models import Q

from . import perms
from .serializers import CategorySerializer, FoodSerializer, ReviewSerializer, FoodDetailSerializer, UserSerializer, \
    UserAnonymousSerializer, OrderSerializer, ReservationSerializer, ChefApproveSerializer, \
    FoodChefSerializer, FoodComparisonSerializer, TableSerializer, FoodCreateSerializer, IngredientSerializer
from .models import Category, Food, User, Review, Order, Reservation, OrderDetail, UserRole, FoodChef, Status_Order, \
    Status_Table, Table, DiningSession, Status_Reservation, Status_Session, Ingredient
from .paginators import FoodPagination, ReviewsPagination


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Category.objects.prefetch_related('foods')
    serializer_class = CategorySerializer

    @action(methods=['GET'], url_path='foods', detail=True)
    def get_foods(self, request, pk):
        foods = self.get_object().foods.filter(active=True)
        return Response(FoodSerializer(foods, many=True).data, status=status.HTTP_200_OK)


class IngredientsViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Ingredient.objects.filter(active=True)
    serializer_class = IngredientSerializer


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
        query = self.queryset.annotate(
            avg_rating=Avg('reviews__rating')
        ).select_related('category').prefetch_related(
            'food_ingredients__ingredients',
            'chefs__chef'
        )

        q = self.request.query_params.get('q')

        if q:
            query = query.filter(dish__icontains=q)
        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)
        chef_id = self.request.query_params.get('chef_id')
        if chef_id:
            query = query.filter(
                chefs__chef_id=chef_id,
                chefs__active=True
            )

        return query

    def get_permissions(self):
        if self.action == ['retrieve', 'list', 'get_review'] and self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        if self.action in ['get_reviews'] and self.request.method.__eq__('POST'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['POST'], url_path='create_food', detail=False, permission_classes=[perms.IsApprovedChef])
    def create_food(self, request):
        s = FoodCreateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        food = s.save()
        FoodChef.objects.create(food=food, chef=request.user)
        return Response(FoodDetailSerializer(food).data, status=status.HTTP_201_CREATED)

    @action(methods=['GET', 'POST'], url_path='reviews', detail=True)
    def get_reviews(self, request, pk):
        if self.request.method.__eq__('POST'):
            s = ReviewSerializer(data={
                'comment': request.data.get('comment'),
                'rating': request.data.get('rating'),
            })
            s.is_valid(raise_exception=True)
            s.save(user=request.user, food=self.get_object())

            return Response(s.data, status=status.HTTP_201_CREATED)

        comments = self.get_object().reviews.select_related('user').filter(active=True)

        p = ReviewsPagination()
        page = p.paginate_queryset(comments, self.request)
        if page is not None:
            serializer = ReviewSerializer(page, many=True)

            return p.get_paginated_response(serializer.data)

        return Response(ReviewSerializer(comments, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['GET', 'POST', 'DELETE'], url_path='chef_control', detail=True,
            permission_classes=[perms.IsAdminRole])
    def manage_chefs(self, request, pk=None):
        food = self.get_object()
        if request.method == 'POST':
            chef_id = request.data.get('chef_id')
            chef = get_object_or_404(
                User,
                pk=chef_id,
                user_role=UserRole.CHEF,
                is_approved=True
            )
            food_chef, created = FoodChef.objects.update_or_create(
                food=food,
                chef=chef,
                defaults={'active': True}
            )

            if not created and not food_chef.active:
                food_chef.active = True

            food_chef.save()

            message = 'Đã gán đầu bếp cho món ăn' if created else 'Đã kích hoạt lại đầu bếp cho món ăn'
            return Response(
                {
                    'message': message,
                    'data': FoodChefSerializer(food_chef).data
                },
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )

        if request.method == 'DELETE':
            chef_id = request.data.get('chef_id')
            food_chef = get_object_or_404(
                FoodChef,
                food=food,
                chef_id=chef_id,
                active=True
            )
            food_chef.active = False
            food_chef.save()
            return Response(
                {'message': 'Đã xóa đầu bếp khỏi món ăn'},
                status=status.HTTP_200_OK
            )

        food_chefs = FoodChef.objects.filter(
            food=food,
            active=True
        ).select_related('chef')

        return Response(
            FoodChefSerializer(food_chefs, many=True).data,
            status=status.HTTP_200_OK
        )

    @action(
        methods=['PATCH', 'DELETE'],  
        url_path='chef_manage_food',
        detail=True,
        permission_classes=[permissions.IsAuthenticated]
    )
    def chef_manage_food(self, request, pk=None):
        user = request.user

        if user.user_role == 'CHEF' and not user.is_approved:
            return Response(
                {'error': 'Tài khoản của bạn chưa được duyệt, không thể quản lý món ăn!'},
                status=status.HTTP_403_FORBIDDEN
            )

        
        food = self.get_object()

        if request.method == 'DELETE':
            food.active = False
            food.save()
            return Response({'message': 'Đã xóa (ẩn) món ăn thành công!'}, status=status.HTTP_200_OK)

        if request.method == 'PATCH':
            serializer = FoodCreateSerializer(food, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            updated_food = serializer.save()

            return Response(
                {
                    'message': 'Đã cập nhật thông tin món ăn!',
                    'data': FoodDetailSerializer(updated_food).data
                },
                status=status.HTTP_200_OK
            )

    @action(methods=['GET'], url_path='compare', detail=False, permission_classes=[permissions.AllowAny])
    def compare_food(self, request):
        ids_param = request.query_params.get('ids', '')

        if not ids_param:
            return Response({'error': 'Hãy chọn những món bạn muốn so sánh!'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            food_ids = list(dict.fromkeys(
                int(id.strip()) for id in ids_param.split(',')
            ))
        except ValueError:
            return Response({'error': 'Danh sách món không hợp lệ, vui lòng chọn lại!'},
                            status=status.HTTP_400_BAD_REQUEST)
        if len(food_ids) < 2:
            return Response(
                {'error': 'Cần ít nhất 2 món để so sánh'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(food_ids) > 3:
            return Response(
                {'error': 'Chỉ so sánh tối đa 3 món cùng lúc'},
                status=status.HTTP_400_BAD_REQUEST
            )

        
        foods_all = Food.objects.filter(id__in=food_ids)
        foods_active = foods_all.filter(active=True)

        
        found_ids = set(foods_all.values_list('id', flat=True))
        not_exist_ids = set(food_ids) - found_ids
        if not_exist_ids:
            return Response(
                {'error': f'Không tìm thấy món ăn với IDs: {not_exist_ids}'},
                status=status.HTTP_404_NOT_FOUND
            )

        
        active_ids = set(foods_active.values_list('id', flat=True))
        inactive_foods = foods_all.exclude(id__in=active_ids)
        if inactive_foods.exists():
            inactive_names = list(inactive_foods.values_list('dish', flat=True))
            return Response(
                {'error': f'Các món sau đang không hoạt động: {inactive_names}'},
                
                status=status.HTTP_404_NOT_FOUND
            )

        foods = foods_active.select_related(
            'category'
        ).prefetch_related(
            'food_ingredients__ingredients'
        ).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews', distinct=True)
        )

        
        
        
        
        
        

        return Response(
            FoodComparisonSerializer(foods, many=True).data,
            status=status.HTTP_200_OK
        )

    @action(methods=['GET'], url_path='top_dishes', detail=False, permission_classes=[AllowAny])
    def top_dishes(self, request):
        top_ids = list(OrderDetail.objects.filter(
            order__status_order='SUCCESS'
        ).values('food_id').annotate(
            total_quantity=Sum('quantity')
        ).order_by('-total_quantity').values_list('food_id', flat=True)[:10])

        
        foods = Food.objects.filter(id__in=top_ids, active=True).annotate(
            avg_rating=Avg('reviews__rating'), )

        
        
        food_dict = {f.id: f for f in foods}
        sorted_foods = [food_dict[f_id] for f_id in top_ids if f_id in food_dict]

        
        serializer = FoodSerializer(sorted_foods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def perform_create(self, serializer):

        role = self.request.data.get('user_role')

        if role:
            if role not in [UserRole.CUSTOMER, UserRole.CHEF]:
                raise ValidationError("Role không hợp lệ!")

        serializer.save()

    @action(methods=['GET', 'PATCH'], url_path='current_user', detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def current_user(self, request):
        u = request.user
        if request.method.__eq__('PATCH'):
            s = UserAnonymousSerializer(u, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            u = s.save()

        return Response(UserSerializer(u).data, status=status.HTTP_200_OK)

    @action(methods=['PATCH'], url_path='change_password', detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        
        if not user.check_password(old_password):
            return Response({'error': 'Mật khẩu hiện tại không chính xác!'}, status=status.HTTP_400_BAD_REQUEST)

        
        if not new_password or len(new_password) < 6:
            return Response({'error': 'Mật khẩu mới phải có ít nhất 6 ký tự!'}, status=status.HTTP_400_BAD_REQUEST)

        
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Đổi mật khẩu thành công!'}, status=status.HTTP_200_OK)

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

        chef.refresh_from_db()
        action = "Duyệt" if chef.is_approved else "từ chối"

        return Response({
            'messages': f'Đã {action} tài khoản đầu bếp {chef.first_name + " " + chef.last_name}',
            'user': ChefApproveSerializer(chef).data
        }, status=status.HTTP_200_OK)

    @action(
        methods=['GET'],
        detail=False,
        url_path='chef_list',
        permission_classes=[permissions.AllowAny]
    )
    def chef_list(self, request):
        is_approved = request.query_params.get('is_approved')

        chefs = User.objects.filter(
            user_role=UserRole.CHEF,
            is_active=True
        )

        if is_approved is not None:
            chefs = chefs.filter(is_approved=is_approved.lower() == 'true')

        data = [{
            'id': chef.id,
            'name': f'{chef.first_name} {chef.last_name}',
            'email': chef.email,
            'avatar': chef.avatar.url if chef.avatar else None,
        } for chef in chefs]

        return Response(data, status=status.HTTP_200_OK)


class ReviewViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Review.objects.filter(active=True)
    serializer_class = ReviewSerializer
    permission_classes = [perms.ReviewOwner]

    @action(methods=['PATCH'], detail=True)
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
        order = Order.objects.filter(user=request.user, status_order=Status_Order.WAITING).first()
        if not order:
            return Response({'message': 'Không có order nào đang chờ cả'}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

    @transaction.atomic
    def partial_update(self, request, pk=None):
        order = self.get_object()
        if order.status_order != Status_Order.WAITING:
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

        if order.status_order != Status_Order.WAITING:
            return Response({'error': 'Bạn không thể hủy order này'}, status=status.HTTP_400_BAD_REQUEST)

        order.status_order = Status_Order.CANCEL
        order.active = False
        order.save()

        return Response({'message': 'Đã hủy order'}, status=status.HTTP_200_OK)

    @transaction.atomic
    @action(
        methods=['POST'],
        detail=True,
        permission_classes=[perms.OrderOwner]
    )
    def payment(self, request, pk=None):
        order = get_object_or_404(Order, pk=pk, user=request.user)

        if order.status_order != Status_Order.WAITING:
            return Response(
                {'error': 'Order này không thể thanh toán'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not order.details.exists():
            return Response(
                {'error': 'Order chưa có món ăn nào'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status_order = Status_Order.SUCCESS
        order.save()

        
        
        session = order.session
        if session:
            waiting_orders = session.orders.filter(
                status_order=Status_Order.WAITING
            ).exists()

            if not waiting_orders:
                session.status_session = Status_Session.CLOSED
                session.closed_at = timezone.now()
                session.save()

                session.table.status_table = Status_Table.AVAILABLE
                session.table.save()

                if session.reservation:
                    session.reservation.status_reservation = Status_Reservation.COMPLETED
                    session.reservation.save()

        
        return Response(
            {'message': 'Thanh toán thành công'},
            status=status.HTTP_200_OK
        )


class TableViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def get_queryset(self):
        queryset = Table.objects.filter(status_table=Status_Table.AVAILABLE)
        start_str = self.request.query_params.get('serve_time')
        qty = self.request.query_params.get('customer_quantity')

        if start_str:
            start = parse_datetime(start_str)
            if start:
                end = start + timedelta(minutes=30)  
                busy_ids = Reservation.objects.filter(
                    active=True,
                    serve_time__lt=end,
                    end_time__gt=start
                ).values_list('table_id', flat=True)
                queryset = queryset.exclude(id__in=busy_ids)

        if qty:
            try:
                queryset = queryset.filter(slot__gte=int(qty))
            except ValueError:
                pass

        return queryset


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
        
        if request.method == 'POST':
            return self._create_reservation(request)

        
        reservation = self._get_upcoming_reservation(request.user)
        if not reservation:
            return Response(
                {'message': 'Bạn không có đặt bàn nào sắp tới'},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == 'PATCH':
            return self._update_reservation(request, reservation)

            
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

    @transaction.atomic
    @action(
        methods=['POST'],
        detail=True,
        permission_classes=[permissions.IsAuthenticated]
    )
    def check_in(self, request, pk=None):
        reservation = self.get_object()

        if reservation.status_reservation != Status_Reservation.CONFIRMED:
            return Response(
                {'error': 'Reservation không hợp lệ'},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()

        
        if now < reservation.serve_time - timedelta(minutes=30):
            return Response(
                {'error': 'Chưa tới giờ check-in'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if now > reservation.end_time:
            return Response(
                {'error': 'Reservation đã hết hạn'},
                status=status.HTTP_400_BAD_REQUEST
            )

        
        reservation.status_reservation = Status_Reservation.CHECKED_IN
        reservation.save()

        
        reservation.table.status_table = Status_Table.OCCUPIED
        reservation.table.save()

        session = DiningSession.objects.create(
            reservation=reservation,
            table=reservation.table,
            customer=reservation.user
        )

        return Response({
            'message': 'Check-in thành công',
            'session_code': session.session_code
        }, status=status.HTTP_200_OK)


class StatisticViewSet(viewsets.ViewSet):
    @action(methods=['GET'], url_path='chef_stats', detail=False, permission_classes=[perms.IsApprovedChef])
    def chef_statistics(self, request):
        period = request.query_params.get('period', 'month')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        view_all = request.query_params.get('view_all', 'false').lower() == 'true'

        trunc_map = {'day': TruncDay, 'week': TruncWeek, 'month': TruncMonth}
        TruncFunc = trunc_map.get(period, TruncMonth)

        date_filter = Q()
        if start_date and end_date:
            date_filter = Q(order__created_date__range=[start_date, end_date])

        food_filter = Q()
        if not view_all:
            chef_food_ids = FoodChef.objects.filter(
                chef=request.user,
                active=True
            ).values_list('food_id', flat=True)
            food_filter = Q(food_id__in=chef_food_ids)
        order_stats = OrderDetail.objects.filter(
            date_filter,
            food_filter,
            order__status_order='SUCCESS'
        ).annotate(
            period=TruncFunc('order__created_date')
        ).values('period').annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum('total_price'),
            order_count=Count('order', distinct=True)
        ).order_by('period')

        food_stats = list(OrderDetail.objects.filter(
            date_filter,
            food_filter,
            order__status_order='SUCCESS'
        ).values(
            'food__id',
            'food__dish'
        ).annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum('total_price')
        ).order_by('-total_revenue'))

        food_ids = [item['food__id'] for item in food_stats]

        ratings = Food.objects.filter(id__in=food_ids).annotate(
            avg_rating=Avg('reviews__rating')
        ).values('id', 'avg_rating')

        rating_dict = {item['id']: item['avg_rating'] for item in ratings}

        for item in food_stats:
            item['avg_rating'] = rating_dict.get(item['food__id'], None)

        
        return Response({
            'period_stats': list(order_stats),
            'food_stats': food_stats
        }, status=status.HTTP_200_OK)

    @action(methods=['GET'], url_path='admin_stats', detail=False, permission_classes=[perms.IsAdminRole])
    def admin_statistics(self, request):
        period = request.query_params.get('period', 'month')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        trunc_map = {'day': TruncDay, 'week': TruncWeek, 'month': TruncMonth}
        TruncFunc = trunc_map.get(period, TruncMonth)

        date_filter = Q()
        if start_date and end_date:
            date_filter = Q(created_date__range=[start_date, end_date])

        reservation_date_filter = Q()
        if start_date and end_date:
            reservation_date_filter = Q(serve_time__range=[start_date, end_date])


        overview = {
            'total_foods': Food.objects.filter(active=True).count(),
            'total_users': User.objects.filter(is_active=True).count(),
            
            'total_orders': Order.objects.filter(date_filter, active=True, status_order='SUCCESS').count(),
            'total_reservations': Reservation.objects.filter(reservation_date_filter, active=True).count(),
            'pending_chefs': User.objects.filter(user_role=UserRole.CHEF, is_approved=False, is_active=True).count(),
        }

        revenue_stats = Order.objects.filter(
            date_filter, status_order='SUCCESS'
        ).annotate(
            period=TruncFunc('created_date')
        ).values('period').annotate(
            total_revenue=Sum('total'),
            order_count=Count('id')
        ).order_by('period')


        reservation_stats = Reservation.objects.filter(
            active=True
        ).annotate(
            period=TruncFunc('serve_time')
        ).values('period').annotate(
            count=Count('id')
        ).order_by('period')

        return Response({
            'overview': overview,
            'revenue_stats': list(revenue_stats),
            'reservation_stats': list(reservation_stats)
        }, status=status.HTTP_200_OK)
