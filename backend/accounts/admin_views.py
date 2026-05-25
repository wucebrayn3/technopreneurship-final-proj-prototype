from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer
from reports.models import Report
from orders.models import Order
from verification.models import Verification

class AdminAccountListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'admin':
            return User.objects.none()
        return User.objects.all()

class AdminAccountToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
            user.is_active = not user.is_active
            user.save()
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        data = {
            'total_customers': User.objects.filter(role='customer').count(),
            'total_sellers': User.objects.filter(role='seller').count(),
            'total_admins': User.objects.filter(role='admin').count(),
            'pending_verifications': Verification.objects.filter(status='Pending').count(),
            'open_reports': Report.objects.filter(status='Open').count(),
            'total_orders': Order.objects.count(),
            'recent_accounts': UserSerializer(User.objects.order_by('-date_joined')[:5], many=True).data,
            'recent_reports': list(Report.objects.order_by('-created_at')[:5].values('id', 'subject', 'reporter__username', 'role', 'status', 'created_at')),
        }
        return Response(data)
