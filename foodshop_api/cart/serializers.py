from rest_framework import serializers
from .models import Cart, CartItem
from menu.models import FoodItem

# Serializer for FoodItem to include detailed information
class FoodItemSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2)  # Ensure decimal format
    discounted_price = serializers.SerializerMethodField()  # Add a new field for discounted price

    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'price', 'discounted_price', 'image']

    def get_discounted_price(self, obj):
        return obj.get_discounted_price()

# Serializer for CartItem, embedding the FoodItemSerializer
class CartItemSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer(read_only=True)  # Embed FoodItem details

    class Meta:
        model = CartItem
        fields = ['id', 'food_item', 'quantity']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be positive.")
        return value

# Serializer for Cart, including CartItems
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)  # Embed CartItems

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']
