from rest_framework import serializers, viewsets
from .models import Category, Food

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
    category = CategorySerializer()

    class Meta:
        model = Food
        fields = ['id', 'dish', 'description', 'price', 'time', 'illustration', 'category']
