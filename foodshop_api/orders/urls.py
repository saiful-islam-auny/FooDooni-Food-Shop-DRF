from django.urls import path
from .views import OrderView, OrderHistoryView

urlpatterns = [
    path('', OrderView.as_view(), name='order'),
    path('history/', OrderHistoryView.as_view(), name='order-history'),
]
