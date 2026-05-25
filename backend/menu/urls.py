from django.urls import path
from . import views

urlpatterns = [
    path('', views.MenuListPublicView.as_view(), name='menu-list'),
    path('seller/', views.SellerMenuListCreateView.as_view(), name='seller-menu-list'),
    path('seller/<int:pk>/', views.SellerMenuDetailView.as_view(), name='seller-menu-detail'),
]
