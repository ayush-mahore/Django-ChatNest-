import os
from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from ChatNest_chat import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatNestBackend.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": URLRouter(
        routing.websocket_urlpatterns
    ),
})
