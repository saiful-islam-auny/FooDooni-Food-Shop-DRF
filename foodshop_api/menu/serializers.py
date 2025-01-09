from rest_framework import serializers
from . import models

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ['id', 'name']

class FoodItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()  # Display category name instead of ID

    class Meta:
        model = models.FoodItem
        fields = ['id', 'name', 'description', 'price', 'image', 'category']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = models.Review
        fields = ['id', 'user', 'food_item', 'rating', 'comment', 'created_at']
