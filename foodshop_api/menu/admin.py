from django.contrib import admin
from .models import Category, FoodItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}  # Automatically populate slug from name
    list_display = ('id', 'name', 'slug')  # Include slug in the admin list view
    search_fields = ('name',)

@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}  # Automatically populate slug from name
    list_display = ('id', 'name', 'category', 'price', 'slug')  # Include slug
    list_filter = ('category',)
    search_fields = ('name', 'category__name')
