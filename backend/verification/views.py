from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Verification
from .serializers import VerificationSerializer

class VerificationListView(generics.ListAPIView):
    queryset = Verification.objects.all().order_by('-submitted_at')
    serializer_class = VerificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'admin':
            return Verification.objects.none()
        return Verification.objects.all().order_by('-submitted_at')

class VerificationActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        try:
            verification = Verification.objects.get(pk=pk)
            action = request.data.get('action')
            if action in ['Approved', 'Rejected']:
                verification.status = action
                verification.reviewed_at = timezone.now()
                verification.reviewed_by = request.user
                verification.save()
                if action == 'Approved':
                    verification.seller.is_verified = True
                    verification.seller.save()
                return Response(VerificationSerializer(verification).data)
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        except Verification.DoesNotExist:
            return Response({'error': 'Verification not found'}, status=status.HTTP_404_NOT_FOUND)
