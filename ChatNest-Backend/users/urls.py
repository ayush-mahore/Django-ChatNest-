from . import views
from django.urls import path
from .views import CreateUserView, GetUserName

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='create-user'),
    path('username/<int:user_id>/', GetUserName, name='get-username'),
]
