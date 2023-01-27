from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    pass

class Message(models.Model):
    sender=models.ForeignKey('User',on_delete=models.CASCADE,related_name='messages_sent')
    receiver=models.ForeignKey('User',on_delete=models.CASCADE,related_name='messages')
    message=models.TextField(blank=False)
    timestamp=models.DateTimeField(auto_now_add=True)
    received=models.BooleanField(default=False)#by the server
    sent=models.BooleanField(default=False)#by the the server to the receiver
    read=models.BooleanField(default=False)#by the receiver



    def serialize(self):
        return {
            'id':self.id,
            'sender':self.sender.username,
            'receiver':self.receiver.username,
            'message':self.message,
            'timestamp':self.timestamp,
            'read':self.read,
            'received':self.received,
            'sent':self.sent,
        }

    def __str__(self):
        return f"message_id:{self.id},Sender:{self.sender},Receiver:{self.receiver},message:{self.message},received:{self.received},sent:{self.sent},read:{self.read}"