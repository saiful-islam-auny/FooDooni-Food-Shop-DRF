from django.db import models
from django.conf import settings
from menu.models import FoodItem

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.food_item.name} - {self.quantity}"

    def save(self, *args, **kwargs):
        # Ensure quantity is always positive
        if self.quantity <= 0:
            self.quantity = 1
        super().save(*args, **kwargs)
