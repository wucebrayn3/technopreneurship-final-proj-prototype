from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/menu/', include('menu.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/verifications/', include('verification.urls')),
    path('api/admin/', include('accounts.admin_urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
