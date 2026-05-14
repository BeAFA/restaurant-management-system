from rest_framework import serializers, viewsets
from .models import Category, Food, Review, User


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


class FoodSerializer(FoodIllustrationSerializer):
    class Meta:
        model = Food
        fields = ['id', 'dish', 'price', 'time', 'illustration']


class FoodDetailSerializer(FoodSerializer):
    category = CategorySerializer()

    class Meta:
        model = FoodSerializer.Meta.model
        fields = FoodSerializer.Meta.fields + ['description', 'category']

    def to_representation(self, food):
        data = super().to_representation(food)

        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            data['rating'] = food.reviews.filter(user=request.user, active=True).exists()

        return data

class UserAnonymousSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'avatar', 'phone']

class UserSerializer(UserAnonymousSerializer):
    class Meta:
        model = UserAnonymousSerializer.Meta.model
        fields = UserAnonymousSerializer.Meta.fields + ['username','password']
        extra_kwargs = {'password': {'write_only': True}}

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

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'food', 'comment', 'rating']
        extra_kwargs = {'food': {'read_only': True}}

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['user'] = UserSerializer(instance.user).data

        return data