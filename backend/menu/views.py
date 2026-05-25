from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import MenuItem
from .serializers import MenuItemSerializer

class MenuListPublicView(generics.ListAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = MenuItem.objects.filter(is_available=True)
        seller_id = self.request.query_params.get('seller')
        if seller_id:
            qs = qs.filter(seller_id=seller_id)
        return qs

class SellerMenuListCreateView(generics.ListCreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return MenuItem.objects.filter(seller=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class SellerMenuDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return MenuItem.objects.filter(seller=self.request.user)
