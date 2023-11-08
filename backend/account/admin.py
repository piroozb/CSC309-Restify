from django.contrib import admin
from .models import UserProfile


# admin.site.unregister(UserAdmin)
admin.site.register(UserProfile)
