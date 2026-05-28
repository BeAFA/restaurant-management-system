from rest_framework import serializers, viewsets
from .models import Category, Food, Review, User, OrderDetail, Order, Table, Reservation, FoodChef, UserRole, \
    Ingredient, \
    FoodIngredient, DiningSession, Status_Session, Status_Reservation


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class FoodIllustrationSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.illustration:
            data['illustration'] = instance.illustration.url

        return data

class FoodIngredientSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='ingredients.name', read_only=True)

    class Meta:
        model = FoodIngredient
        fields = ['id', 'name']

class FoodSerializer(FoodIllustrationSerializer):
    avg_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Food
        fields = ['id', 'dish', 'price', 'time', 'illustration', 'avg_rating']


class FoodDetailSerializer(FoodSerializer):
    category = CategorySerializer()
    ingredients = FoodIngredientSerializer(read_only=True, many=True, source='food_ingredients')

    class Meta:
        model = FoodSerializer.Meta.model
        fields = FoodSerializer.Meta.fields + ['description', 'category', 'ingredients']


class UserAnonymousSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'avatar', 'phone']


class UserSerializer(UserAnonymousSerializer):
    class Meta:
        model = UserAnonymousSerializer.Meta.model
        fields = UserAnonymousSerializer.Meta.fields + ['username', 'password', 'user_role', 'is_approved']
        extra_kwargs = {'password': {'write_only': True},
                        'is_approved': {'read_only': True}}

    def validate_user_role(self, value):

        allowed_roles = [
            UserRole.CUSTOMER,
            UserRole.CHEF
        ]

        if value not in allowed_roles:
            raise serializers.ValidationError(
                "Chỉ được đăng ký tài khoản khách hàng hoặc đầu bếp."
            )

        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.avatar:
            data['avatar'] = instance.avatar.url

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)

        user.set_password(password)
        user.save()

        return user


class ChefApproveSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'is_approved', 'user_role']
        extra_kwargs = {'username': {'read_only': True},
                        'first_name': {'read_only': True},
                        'last_name': {'read_only': True},
                        'user_role': {'read_only': True}}


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'food', 'comment', 'rating', 'created_date']
        extra_kwargs = {
            'food': {'read_only': True},
            'user': {'read_only': True},
            'created_date': {'read_only': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = UserAnonymousSerializer(instance.user).data
        return data


class OrderDetailSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(
        source='food.dish',
        read_only=True
    )

    class Meta:
        model = OrderDetail
        fields = [
            'id',
            'food',
            'dish_name',
            'quantity',
            'unit_price',
            'total_price'
        ]

        extra_kwargs = {
            'unit_price': {'read_only': True},
            'total_price': {'read_only': True}
        }


class OrderSerializer(serializers.ModelSerializer):
    details = OrderDetailSerializer(many=True)
    session_code = serializers.CharField(write_only=True, required=False, allow_null=True)
    reservation_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    table_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)  # ← THÊM DÒNG NÀY
    table = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'table', 'user', 'details',
            'status_order', 'total', 'created_date',
            'session_code', 'reservation_id', 'table_id'  # ← THÊM 'table_id' VÀO ĐÂY
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'total': {'read_only': True},
            'status_order': {'read_only': True}
        }

    def get_table(self, obj):
        if obj.session:
            return obj.session.table.id
        if obj.reservation:
            return obj.reservation.table.id
        if obj.table_direct:
            return obj.table_direct.id
        return None

    def validate(self, attrs):
        session_code = attrs.pop('session_code', None)
        reservation_id = attrs.pop('reservation_id', None)
        table_id = attrs.pop('table_id', None)

        if session_code:
            session = DiningSession.objects.filter(
                session_code=session_code,
                status_session=Status_Session.OPEN
            ).first()
            if not session:
                raise serializers.ValidationError('Session không hợp lệ')
            attrs['session'] = session

        elif reservation_id:
            try:
                reservation = Reservation.objects.get(
                    pk=reservation_id,
                    status_reservation=Status_Reservation.CONFIRMED
                )
            except Reservation.DoesNotExist:
                raise serializers.ValidationError('Reservation không hợp lệ hoặc chưa được xác nhận')
            attrs['reservation'] = reservation
            attrs['session'] = None

        elif table_id:
            try:
                table = Table.objects.get(pk=table_id)
            except Table.DoesNotExist:
                raise serializers.ValidationError('Bàn không tồn tại')
            attrs['table_direct'] = table
            attrs['session'] = None

        else:
            raise serializers.ValidationError(
                'Cần cung cấp session_code, reservation_id, hoặc table_id'
            )

        return attrs

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        order = Order.objects.create(**validated_data)
        for data in details_data:
            OrderDetail.objects.create(order=order, **data)
        return order

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)
        instance.save()
        if details_data is not None:
            instance.details.all().delete()
            for data in details_data:
                OrderDetail.objects.create(order=instance, **data)
        return instance

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        order = Order.objects.create(**validated_data)
        for data in details_data:
            OrderDetail.objects.create(order=order, **data)
        return order

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)
        instance.save()
        if details_data is not None:
            instance.details.all().delete()
            for data in details_data:
                OrderDetail.objects.create(order=instance, **data)
        return instance


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'slot', 'status_table']


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'user', 'table', 'serve_time', 'end_time', 'customer_quantity', 'status_reservation']
        extra_kwargs = {'user': {'read_only': True},
                        'end_time': {'read_only': True},
                        'status_reservation': {'read_only': True},}


class FoodChefSerializer(serializers.ModelSerializer):
    chef = UserAnonymousSerializer(read_only=True)
    chef_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(user_role=UserRole.CHEF, is_approved=True),
        write_only=True,
        source='chef',
    )
    food = FoodSerializer(read_only=True)

    class Meta:
        model = FoodChef
        fields = ['id', 'food', 'chef', 'chef_id']


class FoodComparisonSerializer(serializers.ModelSerializer):
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    ingredients = FoodIngredientSerializer(read_only=True, many=True, source='food_ingredients')

    class Meta:
        model = Food
        fields = ['id', 'dish', 'price', 'illustration', 'time', 'ingredients', 'description', 'category_name',
                  'avg_rating', 'review_count']

class FoodCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category'
    )
    ingredient_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
    )

    class Meta:
        model = Food
        fields = ['id', 'dish','description','category_id', 'price', 'illustration', 'time', 'ingredient_ids']

    def create(self, validated_data):
        ingredient_ids = validated_data.pop('ingredient_ids',[])

        food = Food.objects.create(**validated_data)

        for ingredient_id in ingredient_ids:
            ingredient = Ingredient.objects.get(pk=ingredient_id)

            FoodIngredient.objects.create(food=food, ingredients=ingredient)

        return food

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id','name']