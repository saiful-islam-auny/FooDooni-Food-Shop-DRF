from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100)

    def __str__(self):
        return self.name

class FoodItem(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='menu/images/')
    category = models.ForeignKey(Category, related_name='food_items', on_delete=models.CASCADE)
    special_discount = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def get_discounted_price(self):
        if self.special_discount:
            return self.price - (self.price * (self.special_discount / 100))
        return self.price
    
    def __str__(self):
        return self.name


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodItem, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=1)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.food_item.name} - {self.rating} Stars by {self.user.username}"
