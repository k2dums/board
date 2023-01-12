from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer): 
    async def connect(self):
            self.room_sender=self.scope['url_route']['kwargs']['sender']
            self.room_receiver=self.scope['url_route']['kwargs']['receiver']

            if self.room_sender>=self.room_receiver:
                self.room_group_name='chat_%s%s' % self.room_sender,self.room_receiver
            else:
                self.room_group_name='chat_%s%s' % self.room_receiver,self.room_sender

            #Join a django room group 
            await self.channel_layer.group_add(self.room_group_name,self.channel_name)
            await self.accept()

    async def disconnect(self, close_code):
        self.channel_layer.group_discard(self.room_group_name,self.channel_name)

    async def receive(self, text_data):
        text_data_json=json.load(text_data)
        message=text_data_json['message']
        sender=text_data_json['sender']
        receiver=text_data_json['receiver']
        #Now save this to the database using the await libaries
        await self.channel_layer.group_send(self.room_group_name,{'type':'chat_message','message':message})

    async def chat_message(self,event):
        message=event['message']
        await self.send(text_data=json.dump({'message':message}))

    