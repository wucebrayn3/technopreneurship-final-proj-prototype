from django.db import models
from django.conf import settings

class InventoryItem(models.Model):
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inventory_items')
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=20, default='pcs')
    quantity = models.FloatField(default=0)
    low_stock_threshold = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"
