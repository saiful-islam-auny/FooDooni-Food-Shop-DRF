from django.db import models
from django.conf import settings
from menu.models import FoodItem
from datetime import timedelta

from django.db import models
from django.conf import settings
from datetime import timedelta

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Delivered', 'Delivered'),
        ('Canceled', 'Canceled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    delivery_address = models.TextField()
    phone_number = models.CharField(max_length=15, default="+0000000000")  # Default value
  # Add phone_number field
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    delivery_time = models.DateTimeField(blank=True, null=True)  # New field for delivery time
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_total(self):
        return sum(item.food_item.price * item.quantity for item in self.items.all())

    def set_delivery_time(self, estimated_minutes=30):
        """
        Sets the estimated delivery time.
        Default delivery time is 30 minutes from the current time.
        """
        from django.utils.timezone import now
        self.delivery_time = now() + timedelta(minutes=estimated_minutes)
        self.save()

    def __str__(self):
        return f"Order {self.id} - {self.user.email}"



class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.food_item.name} - {self.quantity}"
