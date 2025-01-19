from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Order, OrderItem
from cart.models import Cart, CartItem
from .serializers import OrderSerializer


from django.utils.timezone import now

class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Fetch the user's cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)

        if not cart.items.exists():
            return Response({"error": "Cart is empty. Add items before placing an order."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate delivery address
        delivery_address = request.data.get("delivery_address")
        if not delivery_address:
            return Response({"error": "Delivery address is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate phone number
        phone_number = request.data.get("phone_number")  # Validate phone number
        if not phone_number:
            return Response({"error": "Phone number is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new order
        order = Order.objects.create(
            user=request.user,
            delivery_address=delivery_address,
            phone_number=phone_number,  # Save phone number in the order
        )

        total_price = 0
        for cart_item in cart.items.all():
            discounted_price = cart_item.food_item.get_discounted_price()
            OrderItem.objects.create(
                order=order,
                food_item=cart_item.food_item,
                quantity=cart_item.quantity,
            )
            total_price += discounted_price * cart_item.quantity

        # Update order total price
        order.total_price = total_price

        # Set delivery time (default 30 minutes)
        order.set_delivery_time(estimated_minutes=30)

        order.save()

        # Clear the cart
        cart.items.all().delete()

        # Serialize and return the created order
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
