from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Report
from .serializers import ReportSerializer, AdminReportSerializer

class ReportCreateView(generics.CreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(reporter=request.user, role=request.user.role)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AdminReportListView(generics.ListAPIView):
    queryset = Report.objects.all().order_by('-created_at')
    serializer_class = AdminReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'admin':
            return Report.objects.none()
        return Report.objects.all().order_by('-created_at')

class AdminReportDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        try:
            report = Report.objects.get(pk=pk)
            new_status = request.data.get('status')
            if new_status in dict(Report.STATUS_CHOICES):
                report.status = new_status
                report.save()
                return Response(AdminReportSerializer(report).data)
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        except Report.DoesNotExist:
            return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)
