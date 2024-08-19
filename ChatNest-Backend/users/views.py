from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
def GetUserName(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return Response({
            'id': user.id,
            'username': user.username,
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
