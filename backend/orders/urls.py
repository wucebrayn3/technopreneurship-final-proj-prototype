from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderCreateView.as_view(), name='order-create'),
    path('my/', views.CustomerOrderListView.as_view(), name='customer-orders'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('seller/', views.SellerOrderListView.as_view(), name='seller-orders'),
    path('<int:pk>/cancel/', views.CancelOrderView.as_view(), name='cancel-order'),
    path('<int:pk>/status/', views.UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('receipts/', views.CustomerReceiptListView.as_view(), name='customer-receipts'),
    path('receipt/<int:pk>/', views.ReceiptDetailView.as_view(), name='receipt-detail'),
    path('receipt/<int:pk>/delete/', views.ReceiptDeleteView.as_view(), name='receipt-delete'),
]
