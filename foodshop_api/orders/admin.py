from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['food_item', 'quantity']  # Read-only fields for OrderItem inline

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_price', 'status', 'delivery_address', 'delivery_time', 'created_at']
    list_filter = ['status', 'created_at', 'delivery_time']  # Add delivery_time to filter
    search_fields = ['user__email', 'delivery_address']
    inlines = [OrderItemInline]
    readonly_fields = ['total_price', 'created_at', 'delivery_time']  # Read-only fields for these fields
    
    # Optionally, you can add an action to bulk update the order status
    actions = ['mark_as_delivered', 'mark_as_canceled']

    def mark_as_delivered(self, request, queryset):
        queryset.update(status='Delivered')
    mark_as_delivered.short_description = 'Mark selected orders as Delivered'

    def mark_as_canceled(self, request, queryset):
        queryset.update(status='Canceled')
    mark_as_canceled.short_description = 'Mark selected orders as Canceled'

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'food_item', 'quantity']
    search_fields = ['food_item__name', 'order__id']
