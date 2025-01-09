from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    food_item_name = serializers.ReadOnlyField(source='food_item.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'food_item', 'food_item_name', 'quantity']


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
            'delivery_time',  # Include delivery_time
            'created_at',
        ]
