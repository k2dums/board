#Django authenticates system, need to sign in or login before acessing the service, and now the user logged 
from channels.auth import AuthMiddlewareStack 

# Mechanics from channels for routing 
from channels.routing import ProtocolTypeRouter,URLRouter
#import the routing from the chatrooms
import chatrooms.routing

#like the compiled url in the project urls
#Similarly for the routes

from django.core.asgi import get_asgi_application

#When we get a websocket (WS) request, this is where to route it 
#We want to utiliize the django authentication thus we wrap the urls to the django auth middleware for authentication
# And finally add the url routers
application=ProtocolTypeRouter({
    "http":get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chatrooms.routing.websocket_urlpatterns 
        )
    ),
})

