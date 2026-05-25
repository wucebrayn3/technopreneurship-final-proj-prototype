import random
import string
from django.db import models
from django.conf import settings

def generate_order_number():
    while True:
        num = 'SC-' + ''.join(random.choices(string.digits, k=4))
        if not Order.objects.filter(order_number=num).exists():
            return num

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Preparing', 'Preparing'),
        ('Ready', 'Ready'),
        ('Picked Up', 'Picked Up'),
        ('Cancelled', 'Cancelled'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('gcash', 'GCash'),
        ('maya', 'Maya'),
        ('cash', 'Cash on Pickup'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
    ]

    order_number = models.CharField(max_length=10, unique=True, default=generate_order_number)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='seller_orders')
    items = models.JSONField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order_number} - {self.customer.username}"

class Receipt(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='receipt')
    receipt_number = models.CharField(max_length=20, unique=True)
    customer_name = models.CharField(max_length=200)
    seller_name = models.CharField(max_length=200)
    items_json = models.JSONField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    is_customer_copy = models.BooleanField(default=True)

    def __str__(self):
        return f"Receipt {self.receipt_number}"
