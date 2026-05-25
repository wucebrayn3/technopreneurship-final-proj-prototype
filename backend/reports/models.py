from django.db import models
from django.conf import settings

class Report(models.Model):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('seller', 'Seller'),
    ]
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Resolved', 'Resolved'),
    ]
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject} - {self.reporter.username}"
