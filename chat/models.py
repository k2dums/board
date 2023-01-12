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
    read=models.BooleanField(default=False)
    archived=models.BooleanField(default=False)

    def serialize(self):
        return {
            'sender':self.sender.username,
            'receiver':self.receiver.username,
            'message':self.message,
            'timestamp':self.timestamp,
            'read':self.read,
            'archived':self.archived
        }