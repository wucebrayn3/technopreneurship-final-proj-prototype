from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from verification.models import Verification

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if user.role == 'seller':
            Verification.objects.get_or_create(seller=user, defaults={'school': user.school})
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class SellerListView(generics.ListAPIView):
    queryset = User.objects.filter(role='seller', is_verified=True, is_active=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class SellerSettingsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'seller':
            return Response({'error': 'Only sellers can access this'}, status=status.HTTP_403_FORBIDDEN)
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        if request.user.role != 'seller':
            return Response({'error': 'Only sellers can access this'}, status=status.HTTP_403_FORBIDDEN)
        user = request.user
        store_name = request.data.get('store_name')
        pickup_window = request.data.get('pickup_window')
        if store_name is not None:
            user.store_name = store_name
        if pickup_window is not None:
            user.pickup_window = pickup_window
        user.save()
        return Response(UserSerializer(user).data)
