from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Cart, CartItem
from menu.models import FoodItem
from .serializers import CartSerializer
from django.http import JsonResponse

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        food_item_id = request.data.get('food_item')
        quantity = request.data.get('quantity', 1)

        if not food_item_id:
            return Response({"error": "Food item is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            food_item = FoodItem.objects.get(id=food_item_id)
        except FoodItem.DoesNotExist:
            return Response({"error": "Food item not found"}, status=status.HTTP_404_NOT_FOUND)

        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, food_item=food_item)

        if not created:
            cart_item.quantity += int(quantity)
        else:
            cart_item.quantity = int(quantity)

        cart_item.save()
        return Response({"message": "Item added to cart successfully"}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        food_item_id = request.data.get('food_item')

        if not food_item_id:
            return Response({"error": "Food item is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.get(cart=cart, food_item_id=food_item_id)
            cart_item.delete()
            return Response({"message": "Item removed from cart"}, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)
    def patch(self, request):
        food_item_id = request.data.get("food_item")

        if not food_item_id:
            return Response({"error": "Food item is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user=request.user)
            cart_item = cart.items.get(food_item_id=food_item_id)

            quantity_change = request.data.get("quantity_change", 0)
            cart_item.quantity += quantity_change

            if cart_item.quantity <= 0:
                cart_item.delete()  # Remove the item if quantity becomes zero or less
            else:
                cart_item.save()

            return Response({"message": "Cart item updated successfully."}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SessionCartView(APIView):
    def get(self, request):
        session_cart = request.session.get('cart', [])
        return JsonResponse({'items': session_cart}, safe=False)

    def post(self, request):
        item = request.data
        session_cart = request.session.get('cart', [])
        
        # Add item to session cart
        session_cart.append(item)
        request.session['cart'] = session_cart
        request.session.modified = True
        
        return JsonResponse({'message': 'Item added to session cart'}, status=201)

    def delete(self, request):
        item_id = request.data.get('id')
        session_cart = request.session.get('cart', [])
        
        # Remove item from session cart
        session_cart = [item for item in session_cart if item.get('id') != item_id]
        request.session['cart'] = session_cart
        request.session.modified = True

        return JsonResponse({'message': 'Item removed from session cart'}, status=200)
