from django.urls import path 
from . import views

app_name='chat'
#Based on the settings from the project thus chat/register
urlpatterns=[
  path('',views.index_view,name='index'),
  path('register/',views.register_view,name='register'),
  path('login/',views.login_view,name='login'),
  path('logout/',views.logout_view,name='logout'),
  path('<str:username>',views.profile_view,name='profile'),
 



  #api route
  path('api/<str:username>',views.load_recentChats_view,name='recent_chats'),#chat/k2dums
  path('api/<str:username>/<str:chatUser>',views.load_chat_messages_view,name='chat_message'),

]

