from django.contrib import admin
from .models import User,Message
class MessageAdmin(admin.ModelAdmin):
    list_display=('sender','receiver','message','timestamp')
# Register your models here.
admin.site.register(User)
admin.site.register(Message,MessageAdmin)