import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message,User
import logging
from django.db.models import Q
import datetime
logging.basicConfig(level=logging.INFO)
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json["message"]
            sender=text_data_json['sender']
            receiver=text_data_json['receiver']
            receiver_id=text_data_json['receiver_id']
            sender_id=text_data_json['sender_id']
            output={'message':message,'sender':sender,'receiver':receiver,'receiver_id':receiver_id}
            logging.info(f'[Received], {output} from {sender}')
        except Exception as e:
            logging.error(f'[Error-Receiving],Traceback: chat.consumer.recieve(),{e}')

        # logging.info({'message':message,'sender':sender,'receiver':receiver,'receiver_id':receiver_id})
        receiver_obj=await self.get_user(receiver_id)
        other_room=''
        if receiver_obj:
            other_room="chat_%s" % receiver_id
        else:
            return None
        sender_obj=await self.get_user(sender_id)

        # Send message to room group
        saved_message_id,saved_message_timestamp=await self.save_message({'message':message,'receiver':receiver_obj,'sender':sender_obj})
        #get number of unread messages

        first_unreadId,receiver_unreadCount=await self.get_unreadMessagesCount(sender_obj,receiver_obj)
        time=str(saved_message_timestamp)
        print(type(time))
        try:
            await self.channel_layer.group_send(
            self.room_group_name,{'type':"chat_message","id":saved_message_id,"message":message,'sender':sender,'receiver':receiver,'receiver_id':receiver_id,'sender_id':sender_id,'time':time}
            )
            await self.channel_layer.group_send(
                other_room, {"type": "chat_message","id":saved_message_id,"message": message,'sender':sender,'receiver':receiver,'receiver_id':receiver_id,'sender_id':sender_id,'time':time,'unread':{'count':receiver_unreadCount,'first_unreadId':first_unreadId}}
            )
        except Exception as e:
            logging.error(f'[Error-Sending Messages], Traceback: chat.consumer.recieve(), {e}')

    # Receive message from room group
    async def chat_message(self, event):
        try:
            # id=event['id']
            # message =event["message"]
            # sender=event['sender']
            # receiver=event['receiver']
            # receiver_id=event['receiver_id']
            # sender_id=event['sender_id']
            unread=event.get('unread')
            data={
            'id':event['id'],
            'message':event["message"],
            'sender':event['sender'],
            'receiver':event['receiver'],
            'receiver_id':event['receiver_id'],
            'sender_id':event['sender_id'],
            'unread':event.get('unread'),
            'time':event['time'],
            }
            if unread:
                data['unread']=unread
                await self.send(text_data=json.dumps(data))
            else:
            # Send message to WebSocket
                await self.send(text_data=json.dumps(data))
            logging.info(f"[Sending], {data} to {data['receiver']} and {data['sender']}")
        except Exception as e:
            logging.error(f'[Error Sending message], Traceback: chat.consumers.chat_message, {e}')
    

    @database_sync_to_async
    def save_message(self,message):
        try:
            messg_obj=Message(sender=message['sender'],receiver=message['receiver'],message=message['message'])
            messg_obj.received=True
            messg_obj.save()
            logging.info(f"[Saved],{message} from {message['sender']}")
        except Exception as e:
            logging.error(f'[Error-Saving message to database],Traceback: chat.consumers.save_message(),{e}')
        return messg_obj.id,messg_obj.timestamp

    @database_sync_to_async
    def get_unreadMessagesCount(self,sender,receiver):
        messgs=Message.objects.filter(sender=sender,receiver=receiver,read=False).order_by('timestamp')
        first=messgs.first()
        count=messgs.count()
        print(first)
        if first:
            first=first.id
        return first,count

    @database_sync_to_async
    def get_user(self,user_id):
        try:
            users = User.objects.filter(id=user_id)
            if users.exists():
                obj =users.first()
            else:
                obj = None
            return obj
        except Exception as e:
            logging.error(f'[Error-Getting user from database],Traceback: chat.consumer.get_user(),{e}')
       
