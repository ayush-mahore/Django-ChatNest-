from . import views
from django.urls import path
from ChatNest_chat.views import CreateRoom, MessageView

urlpatterns = [
    path('', CreateRoom, name='create-room'),
    path('<str:room_name>/<str:username>/',
         MessageView, name='room'),
]
