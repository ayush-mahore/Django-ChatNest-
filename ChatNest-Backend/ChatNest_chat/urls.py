from . import views
from django.urls import path
from ChatNest_chat.views import create_or_get_room, MessageView

urlpatterns = [
    path('group/', create_or_get_room, name='create-room'),
    path('group/<str:room_name>/<str:username>/',
         MessageView, name='room'),
]
