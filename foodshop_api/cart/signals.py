from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .models import Cart, CartItem
from menu.models import FoodItem

@receiver(user_logged_in)
def migrate_session_cart_to_user_cart(sender, request, user, **kwargs):
    session_cart = request.session.get('cart', [])
    if session_cart:
        cart, _ = Cart.objects.get_or_create(user=user)
        for item in session_cart:
            try:
                food_item = FoodItem.objects.get(id=item['food_item'])
                cart_item, created = CartItem.objects.get_or_create(cart=cart, food_item=food_item)
                cart_item.quantity += item.get('quantity', 1)
                cart_item.save()
            except FoodItem.DoesNotExist:
                continue
        # Clear session cart
        request.session['cart'] = []
        request.session.modified = True
