from django.urls import path
from . import admin_views

urlpatterns = [
    path('accounts/', admin_views.AdminAccountListView.as_view(), name='admin-accounts'),
    path('accounts/<int:pk>/toggle/', admin_views.AdminAccountToggleView.as_view(), name='admin-account-toggle'),
    path('dashboard/', admin_views.AdminDashboardView.as_view(), name='admin-dashboard'),
]
