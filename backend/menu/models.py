from django.db import models
from django.conf import settings

class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('Mains', 'Mains'),
        ('Snacks', 'Snacks'),
        ('Drinks', 'Drinks'),
        ('Desserts', 'Desserts'),
        ('Signature', 'Signature'),
    ]
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Mains')
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='menu_items/', blank=True, null=True)
    ingredients_required = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (₱{self.price})"
