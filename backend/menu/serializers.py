from rest_framework import serializers
from .models import MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.store_name', read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'category', 'is_available', 'image', 'ingredients_required', 'seller', 'seller_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'seller', 'seller_name']
