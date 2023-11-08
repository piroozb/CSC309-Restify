from django.contrib import admin
from .models import CommentUser, CommentListing, Reply

admin.site.register(CommentUser)
admin.site.register(CommentListing)
admin.site.register(Reply)
