import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message,User
import logging

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
        await self.save_message({'message':message,'receiver':receiver_obj,'sender':sender_obj})
        
        try:
            await self.channel_layer.group_send(
            self.room_group_name,{'type':"chat_message","message":message,'sender':sender,'receiver':receiver,'receiver_id':receiver_id,'sender_id':sender_id}
            )
            await self.channel_layer.group_send(
                other_room, {"type": "chat_message", "message": message,'sender':sender,'receiver':receiver,'receiver_id':receiver_id,'sender_id':sender_id}
            )
            logging.info(f"[Sending], data to {receiver} and {sender}")
        except Exception as e:
            logging.error(f'[Error-Sending Messages], Traceback: chat.consumer.recieve(), {e}')

    # Receive message from room group
    async def chat_message(self, event):
        try:
            message =event["message"]
            sender=event['sender']
            receiver=event['receiver']
            receiver_id=event['receiver_id']
            sender_id=event['sender_id']
            # Send message to WebSocket
            await self.send(text_data=json.dumps({'message': message,'receiver':receiver,'sender':sender,'receiver_id':receiver_id,'sender_id':sender_id}))
        except Exception as e:
            logging.error(f'[Error Sending message], Traceback: chat.consumers.chat_message, {e}')
    

    @database_sync_to_async
    def save_message(self,message):
        try:
            messg_obj=Message(sender=message['sender'],receiver=message['receiver'],message=message['message'])
            messg_obj.save()
            logging.info(f"[Saved],{message} from {message['sender']}")
        except Exception as e:
            logging.error(f'[Error-Saving message to database],Traceback: chat.consumers.save_message(),{e}')

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
       
