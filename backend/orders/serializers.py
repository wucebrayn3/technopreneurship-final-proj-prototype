from rest_framework import serializers
from .models import Order, Receipt
from menu.models import MenuItem

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    seller_name = serializers.CharField(source='seller.store_name', read_only=True)
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'customer', 'customer_name', 'seller', 'seller_name',
                  'items', 'total_amount', 'status', 'payment_method', 'payment_status',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'order_number', 'customer', 'payment_status', 'created_at', 'updated_at']

    def get_items(self, obj):
        enriched = []
        for item in obj.items:
            mitem = MenuItem.objects.filter(id=item.get('menu_item_id')).first()
            enriched.append({
                'menu_item_id': item['menu_item_id'],
                'quantity': item['quantity'],
                'name': mitem.name if mitem else f"Item #{item['menu_item_id']}",
                'price': str(mitem.price) if mitem else '0',
            })
        return enriched

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['seller', 'items', 'total_amount', 'payment_method']

class ReceiptSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    order_number = serializers.CharField(source='order.order_number', read_only=True)

    class Meta:
        model = Receipt
        fields = ['id', 'order', 'order_number', 'receipt_number', 'customer_name', 'seller_name',
                  'items', 'total', 'payment_method', 'created_at', 'is_customer_copy']

    def get_items(self, obj):
        enriched = []
        for item in obj.items_json:
            mitem = MenuItem.objects.filter(id=item.get('menu_item_id')).first()
            enriched.append({
                'menu_item_id': item['menu_item_id'],
                'quantity': item['quantity'],
                'name': mitem.name if mitem else f"Item #{item['menu_item_id']}",
                'price': str(mitem.price) if mitem else '0',
            })
        return enriched
