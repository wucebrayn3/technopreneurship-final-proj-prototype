from rest_framework import serializers
from .models import Verification
from menu.models import MenuItem

class VerificationSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    seller_email = serializers.CharField(source='seller.email', read_only=True)
    menu_items = serializers.SerializerMethodField()

    class Meta:
        model = Verification
        fields = ['id', 'seller', 'seller_name', 'seller_email', 'school', 'status', 'submitted_at', 'reviewed_at', 'menu_items']
        read_only_fields = ['id', 'seller', 'seller_name', 'seller_email', 'status', 'submitted_at', 'reviewed_at', 'menu_items']

    def get_menu_items(self, obj):
        items = MenuItem.objects.filter(seller=obj.seller)
        request = self.context.get('request')
        result = []
        for i in items:
            item = {'id': i.id, 'name': i.name, 'description': i.description, 'price': str(i.price), 'category': i.category}
            if i.image:
                try:
                    url = i.image.url
                    if request:
                        item['image'] = request.build_absolute_uri(url)
                    else:
                        item['image'] = url
                except Exception:
                    item['image'] = None
            result.append(item)
        return result

class VerificationActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['Approved', 'Rejected'])
