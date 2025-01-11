from rest_framework import serializers
from . import models

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ['id', 'name']

class FoodItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()  # Display category name instead of ID
    discounted_price = serializers.SerializerMethodField()  # Add discounted price

    class Meta:
        model = models.FoodItem
        fields = ['id', 'name', 'description', 'price', 'discounted_price', 'image', 'category']

    def get_discounted_price(self, obj):
        return obj.get_discounted_price()

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = models.Review
        fields = ['id', 'user', 'food_item', 'rating', 'comment', 'created_at']
