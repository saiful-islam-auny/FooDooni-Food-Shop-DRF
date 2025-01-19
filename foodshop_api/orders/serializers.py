from rest_framework import serializers
from .models import Order, OrderItem
from menu.models import FoodItem


class OrderItemSerializer(serializers.ModelSerializer):
    food_item_name = serializers.ReadOnlyField(source='food_item.name')
    food_item_image = serializers.ReadOnlyField(source='food_item.image.url')  # Add image
    food_item_discounted_price = serializers.SerializerMethodField()  # Add discounted price

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'food_item',
            'food_item_name',
            'food_item_image',
            'food_item_discounted_price',
            'quantity',
        ]

    def get_food_item_discounted_price(self, obj):
        return obj.food_item.get_discounted_price()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'items',
            'total_price',
            'status',
            'delivery_address',
            'phone_number',
            'delivery_time',  # Include delivery_time
            'created_at',
        ]
