from django.shortcuts import render
from django.contrib.auth import authenticate,login,logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages
from .models import User,Message
from django.db import IntegrityError
from django.http import JsonResponse
# Create your views here.

def index_view(request):
    return render(request,'chat/index.html')

def profile_view(request,username):
    if not(request.user.is_authenticated):
        return HttpResponseRedirect(reverse('chat:login'))

    return render(request,"chat/chat.html",{'username':username,'users':users},)


def register_view (request):
    if request.method=='POST':
        #Get the user field from the form
        username=request.POST.get('username')
        email=request.POST.get('email')
        password=request.POST.get('password')
        confirm_password=request.POST.get('confirm_password')
        if password!=confirm_password:
            return render(request,'chat/register.html',{'message':"Passwords must match"})
        #Need to make sure the fields have valid values

        #Attempt to create new user
        try:
            user=User.objects.create_user(username,email,password)
            user.save()
        except IntegrityError:
            return render(request,'chat/register.html',{
                'messsage':'Username already taken'
            })
        login(request,user)
        return HttpResponseRedirect(reverse('chat:profile',kwargs={'username':request.user.username}))

    else:#For GET/PUT....
        return render(request,'chat/register.html',{})

def login_view(request):
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')

        user=authenticate(request,username=username,password=password)

        if user is not None:#Authenticated
            login(request,user)
            return HttpResponseRedirect(reverse('chat:profile',kwargs={'username':request.user.username}))
        
        else: #Not authenticated
            return render(request,'chat/login.html',{'message':'Invalid username or password'})
    else:#For Get/PUT...
        return render(request,'chat/login.html')

def logout_view(request):
    logout(request)
    messages.info(request,'You have been logged out')
    return HttpResponseRedirect(reverse('chat:login'))



# all the users that the  user  has a chatlog with
def load_chatbox_withUsers(request):
    pass

#Load the chat , populate the window with the messages with the user in focus
def load_chatbox_messages(request,username):
    try:
        user=User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'Error':'User Profile not found','status':404})
    #Load all the messages with the user
    if request.method=='GET':
        chat_messages=Message.objects.filter(sender=request.user,receiver=user)
        return JsonResponse([chat_message.serialize() for chat_message in chat_messages ],safe=False)