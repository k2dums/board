"""
ASGI config for k2dums project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""


import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'k2dums.settings')


#Django authenticates system, need to sign in or login before acessing the service, and now the user logged 
from channels.auth import AuthMiddlewareStack 

# Mechanics from channels for routing 
from channels.routing import ProtocolTypeRouter,URLRouter
#import the routing from the chatrooms
import chat.routing
import chatrooms.routing

#like the compiled url in the project urls
#Similarly for the routes

from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator

#When we get a websocket (WS) request, this is where to route it 
#We want to utiliize the django authentication thus we wrap the urls to the django auth middleware for authentication
# And finally add the url routers
application=ProtocolTypeRouter({
    "http":get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(
                chat.routing.websocket_urlpatterns
                + chatrooms.routing.websocket_urlpatterns
            ))
        ),
})

