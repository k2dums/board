from django.contrib import admin
from .models import User,Message
class MessageAdmin(admin.ModelAdmin):
    list_display=('id','sender','receiver','message','timestamp','received','sent','read')

class UserAdmin(admin.ModelAdmin):
    list_display=('id','username')
# Register your models here.
admin.site.register(User,UserAdmin)
admin.site.register(Message,MessageAdmin)