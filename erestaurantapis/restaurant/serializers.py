from rest_framework import serializers, viewsets
from .models import Category, Food, Review, User, OrderDetail, Order, Table, Reservation, FoodChef, UserRole, \
    Ingredient, \
    FoodIngredient, DiningSession, Status_Session


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
        fields = ['id', 'user', 'food', 'comment', 'rating']
        extra_kwargs = {'food': {'read_only': True},
                        'user': {'read_only': True}}

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['user'] = UserAnonymousSerializer(instance.user).data

        return data


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = ['id', 'food', 'quantity', 'unit_price', 'total_price']
        extra_kwargs = {
            'unit_price': {'read_only': True},
            'total_price': {'read_only': True}
        }


class OrderSerializer(serializers.ModelSerializer):
    details = OrderDetailSerializer(many=True)
    session_code = serializers.CharField(write_only=True)
    table = serializers.CharField(source='session.table.id')


    class Meta:
        model = Order
        fields = ['id', 'table', 'user', 'details', 'status_order', 'total', 'created_date', 'session_code']
        extra_kwargs = {
            'user': {'read_only': True},
            'total': {'read_only': True},
            'status_order': {'read_only': True}
        }

    def create(self, validated_data):
        details_data = validated_data.pop('details')

        order = Order.objects.create(**validated_data)

        for data in details_data:
            OrderDetail.objects.create(order=order, **data)

        return order

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)

        instance.table = validated_data.get('table', instance.table)
        instance.save()

        if details_data is not None:
            instance.details.all().delete()

            for data in details_data:
                OrderDetail.objects.create(order=instance, **data)

        return instance

    def validate(self, attrs):
        session_code = attrs.pop('session_code')

        session = DiningSession.objects.filter(
            session_code=session_code,
            status_session=Status_Session.OPEN
        ).first()

        if not session:
            raise serializers.ValidationError(
                'Session không hợp lệ'
            )

        attrs['session'] = session

        return attrs

    def create(self, validated_data):
        details_data = validated_data.pop('details')

        order = Order.objects.create(**validated_data)

        for data in details_data:
            OrderDetail.objects.create(
                order=order,
                **data
            )

        return order

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
