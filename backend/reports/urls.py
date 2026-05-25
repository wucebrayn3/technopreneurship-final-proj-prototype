from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReportCreateView.as_view(), name='report-create'),
    path('admin/', views.AdminReportListView.as_view(), name='admin-reports'),
    path('admin/<int:pk>/', views.AdminReportDetailView.as_view(), name='admin-report-detail'),
]
