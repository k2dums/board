from django.shortcuts import render,HttpResponse
from django.contrib.auth import authenticate,login,logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages
from .models import User,Message
from django.db import IntegrityError
from django.http import JsonResponse
from django.db import connection
from django.db.models import Q
import json
# Create your views here.
def index_view(request):
    return render(request,'chat/index.html')

def profile_view(request,username):
    if not(request.user.is_authenticated) or username!=request.user.username:
        return HttpResponseRedirect(reverse('chat:login'))
        
    return render(request,"chat/chat.html",{'username':username})


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





















#-------------------------------------API CALLS----------------------------

# all the users that the  user  has a chatlog with
def load_recentChats_view(request,username):
    if username!=request.user.username:
        return JsonResponse({'Error':'Invalid Path'},status=400)
    output=None
    with connection.cursor() as cursor:
        cursor.execute( ''' 
select message_id as latestMessageId,username,latestMessagetable.user_id,message as latestMessageWithUser,timestamp,unread as unreadMessagesWithUser,first_unread as first_unread_messageID from 
(
select t.id as message_id,c.username,c.id as user_id,t.message,t.timestamp from chat_user as c
join
(Select t.withUser,m.message,m.id,m.timestamp from chat_message as m
join(
select withUser,max(latestMessage) as latestMessageBetweenUsers
from (
(select receiver_id as withUser ,max(timestamp) as latestMessage from chat_message where sender_id=%s group by receiver_id)
UNION
(select sender_id as withUser ,max(timestamp) as latestMessage from chat_message where receiver_id=%s group by sender_id)
) as t group by t.withUser
) as t
on (t.withUser=m.receiver_id Or t.withUser=m.sender_id) and m.timestamp=t.latestMessageBetweenUsers
where (m.receiver_id=%s or m.sender_id=%s)
order by m.timestamp desc) as t
on(t.withUser=c.id)
) as latestMessageTable
left JOIN
(  
select UnreadCountTable.user_id,UnreadCountTable.unread,FirstUnreadTable.first_unread from 
(Select user_id,count(read) as unread from
(
select sender_id as user_id ,message,read from chat_message where receiver_id=%s
) as t
where read=false
group by user_id) as UnreadCountTable
JOIN
(
Select m.id as first_unread,InnerFirstUnreadTable.user_id from chat_message as m
join(
select user_id,min(timestamp) as first_unread
from (select sender_id as user_id,message,read,timestamp from chat_message where receiver_id=%s) as t
group by user_id
) as InnerFirstUnreadTable
on (InnerFirstUnreadTable.user_id=m.sender_id) and m.timestamp=InnerFirstUnreadTable.first_unread
where (m.receiver_id=3)
) as FirstUnreadTable
on (UnreadCountTable.user_id=FirstUnreadTable.user_id)) as unreadTable
on (latestMessageTable.user_id=unreadTable.user_id)
order by timestamp desc;


                        ''',
[request.user.id,request.user.id,request.user.id,request.user.id,request.user.id,request.user.id,] )

        row = cursor.fetchall()
        output=serialize_recent_chats(row)
    return JsonResponse(output,safe=False)

#Load the chat , populate the window with the messages with the user in focus
def load_chat_messages_view(request,username,chatUser):
    if username!=request.user.username:
        return JsonResponse({'Error':'Invalid Path'},status=400)
    try:
        user=User.objects.get(username=chatUser)
    except User.DoesNotExist:
        return JsonResponse({'Error':'User Profile not found','status':404})
    #Load all the messages with the user
    if request.method=='GET':
        chat_messages=Message.objects.filter( Q(sender=request.user,receiver=user)| Q(receiver=request.user,sender=user))
        chat_messages=chat_messages.order_by('timestamp').all()
        return JsonResponse([chat_message.serialize() for chat_message in chat_messages ],safe=False)

def serialize_recent_chats(rows):
    output=[]
    for row in rows:
        output.append( 
        {
        'message_id':row[0],
        'username':row[1],
        'user_id':row[2],
        'message':row[3],
        'time':row[4],
        'unread':None if row[5]==None and row[6]==None else {'count':row[5],'first_unreadId':row[6]},
        }
        )
    return output
            
        

def message_view(request,message_id):
    if request.method=='PUT':
        try:
            message=Message.objects.get(id=message_id)
        except Exception as e:
            return JsonResponse({'error':e},status=404)
        data=json.loads(request.body)
        changed_flag=False
        if data.get('read') is not None:
            message.read=data['read']
            changed_flag=True
        if data.get('received') is not None:
            message.received=data['received']
            changed_flag=True
        if data.get('sent') is not None:
            message.sent=data['sent']
            changed_flag=True
        if changed_flag:
            message.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            "error": "Only PUT request accepted."
        }, status=400)

