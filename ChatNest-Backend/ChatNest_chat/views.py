from django.shortcuts import render, redirect
from .models import Room, Message
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def CreateRoom(request):
    if request.method == 'POST':
        username = request.POST['username']
        room = request.POST['room']
        try:
            get_room = Room.objects.get(room_name=room)
        except Room.DoesNotExist:
            new_room = Room(room_name=room)
            new_room.save()

        return redirect('room', room_name=room, username=username)

    return render(request, 'index.html')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def MessageView(request, room_name, username):
    try:
        get_room = Room.objects.get(room_name=room_name)
        get_messages = Message.objects.filter(room=get_room, sender=username).values('message', 'sender')
        return Response({"messages": list(get_messages)}, status=status.HTTP_200_OK)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)