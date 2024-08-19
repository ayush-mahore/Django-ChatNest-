from django.shortcuts import render, redirect
from .models import Room, Message
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_or_get_room(request):
    room_name = request.data.get('room')
    username = request.data.get('username')

    if not room_name or not username:
        return Response({"error": "Room name and username are required."}, status=status.HTTP_400_BAD_REQUEST)

    room, created = Room.objects.get_or_create(room_name=room_name)

    return Response({"room_name": room.room_name, "created": created}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def MessageView(request, room_name, username):
    try:
        get_room = Room.objects.get(room_name=room_name)
        get_messages = Message.objects.filter(room=get_room).values('message', 'sender')
        return Response({"messages": list(get_messages)}, status=status.HTTP_200_OK)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)