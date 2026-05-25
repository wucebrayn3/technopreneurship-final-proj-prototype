from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    school = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    store_name = models.CharField(max_length=200, blank=True)
    pickup_window = models.CharField(max_length=100, blank=True, default='10:30 – 12:30')
    is_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'admin'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"
