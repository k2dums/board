from django.urls import path 
from . import views

app_name='chat'
#Based on the settings from the project thus chat/register
urlpatterns=[
  path('',views.index_view,name='index'),
  path('register/',views.register_view,name='register'),
  path('login/',views.login_view,name='login'),
  path('logout/',views.logout_view,name='logout'),



  #api route
  path('<str:username>/',views.load_chatbox,name='chatbox'),#chat/k2dums

]

