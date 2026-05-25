import random
import string
from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, Receipt
from inventory.models import InventoryItem
from menu.models import MenuItem
from .serializers import OrderSerializer, OrderCreateSerializer, ReceiptSerializer

def generate_receipt_number():
    return 'RCP-' + ''.join(random.choices(string.digits, k=6))

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        seller = serializer.validated_data['seller']
        items = serializer.validated_data['items']
        total = serializer.validated_data['total_amount']
        payment_method = serializer.validated_data['payment_method']

        for item_data in items:
            menu_item = MenuItem.objects.get(id=item_data['menu_item_id'])
            qty = item_data['quantity']
            ingredients = menu_item.ingredients_required or {}
            for ing_name, ing_qty in ingredients.items():
                inv_items = InventoryItem.objects.filter(seller=seller, name__iexact=ing_name)
                if inv_items.exists():
                    inv = inv_items.first()
                    inv.quantity = max(0, inv.quantity - ing_qty * qty)
                    inv.save()

        order = Order.objects.create(
            customer=request.user,
            seller=seller,
            items=items,
            total_amount=total,
            payment_method=payment_method,
            payment_status='Paid' if payment_method != 'cash' else 'Pending',
        )

        # Create receipt
        receipt = Receipt.objects.create(
            order=order,
            receipt_number=generate_receipt_number(),
            customer_name=request.user.username,
            seller_name=seller.store_name or seller.username,
            items_json=items,
            total=total,
            payment_method=payment_method,
            is_customer_copy=True,
        )

        return Response({
            'order': OrderSerializer(order).data,
            'receipt': ReceiptSerializer(receipt).data,
        }, status=status.HTTP_201_CREATED)

class CustomerOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).order_by('-created_at')

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)

class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, customer=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        if order.status != 'Pending':
            return Response({'error': 'Only pending orders can be cancelled'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'Cancelled'
        order.save()
        return Response(OrderSerializer(order).data)

class SellerOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(seller=self.request.user).order_by('-created_at')

class UpdateOrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, seller=request.user)
            new_status = request.data.get('status')
            if new_status in dict(Order.STATUS_CHOICES):
                order.status = new_status
                order.save()
                return Response(OrderSerializer(order).data)
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

class ReceiptDetailView(generics.RetrieveAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Receipt.objects.filter(order__customer=self.request.user) | Receipt.objects.filter(order__seller=self.request.user)

class CustomerReceiptListView(generics.ListAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Receipt.objects.filter(order__customer=self.request.user).order_by('-created_at')

class ReceiptDeleteView(generics.DestroyAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Receipt.objects.filter(order__customer=self.request.user)
