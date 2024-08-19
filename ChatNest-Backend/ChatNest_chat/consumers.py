import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from ChatNest_chat.models import Room, Message

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Retrieve room name from URL parameters
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'room_{self.room_name}'

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message', '')

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': text_data_json
            }
        )

    async def send_message(self, event):
        message = event['message']

        # Save message to database
        await self.create_message(message)

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def create_message(self, data):
        try:
            room = Room.objects.get(room_name=data['room_name'])
            if not Message.objects.filter(room=room, message=data['message']).exists():
                Message.objects.create(
                    room=room,
                    sender=data['sender'],
                    message=data['message']
                )
        except Room.DoesNotExist:
            pass
