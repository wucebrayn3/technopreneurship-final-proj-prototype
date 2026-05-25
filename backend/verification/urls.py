from django.urls import path
from . import views

urlpatterns = [
    path('', views.VerificationListView.as_view(), name='verification-list'),
    path('<int:pk>/', views.VerificationActionView.as_view(), name='verification-action'),
]
