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
  path('api/<str:username>/',views.load_chatbox_messages,name='chatbox'),#chat/k2dums

]

