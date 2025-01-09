from rest_framework.viewsets import ModelViewSet
from .models import Category, FoodItem, Review
from .serializers import CategorySerializer, FoodItemSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import ReviewSerializer
from rest_framework import status

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class FoodItemViewSet(ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer


class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        food_item_id = data.get('food_item')

        try:
            food_item = FoodItem.objects.get(id=food_item_id)
        except FoodItem.DoesNotExist:
            return Response({"error": "Food item not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user, food_item=food_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, food_item_id=None):
        if food_item_id:
            reviews = Review.objects.filter(food_item_id=food_item_id)
        else:
            reviews = Review.objects.all()

        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            review.delete()
            return Response({"message": "Review deleted."}, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)

class SpecialsView(APIView):
    def get(self, request):
        specials = FoodItem.objects.filter(special_discount__isnull=False)
        serializer = FoodItemSerializer(specials, many=True)
        return Response(serializer.data)
