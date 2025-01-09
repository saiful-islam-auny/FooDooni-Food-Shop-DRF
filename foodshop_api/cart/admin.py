from django.contrib import admin
from .models import Cart, CartItem

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username', 'user__email')
    list_filter = ('created_at',)
    ordering = ('-created_at',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'food_item', 'quantity', 'added_at')
    search_fields = ('food_item__name', 'cart__user__username')
    list_filter = ('added_at',)
    ordering = ('-added_at',)
