from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, FoodItemViewSet, SpecialsView

# Create a DefaultRouter and register viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'food-items', FoodItemViewSet, basename='food-item')

# Add paths for the router and specials view
urlpatterns = [
    path('', include(router.urls)),  # Includes categories and food-items routes
    path('specials/', SpecialsView.as_view(), name='specials'),  # Route for specials
    
]
