from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/user/', include("users.urls")),
    path('auth/token/', TokenObtainPairView.as_view(), name="get-token"),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name="refresh-token"),
    path('auth-api/', include("rest_framework.urls")),
    path('', include("ChatNest_chat.urls")),
]
