from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.CharField(source='reporter.username', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'reporter', 'reporter_name', 'role', 'subject', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'reporter', 'status', 'created_at', 'updated_at']

class AdminReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.CharField(source='reporter.username', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'reporter', 'reporter_name', 'role', 'subject', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'reporter', 'reporter_name', 'role', 'subject', 'description', 'created_at', 'updated_at']
