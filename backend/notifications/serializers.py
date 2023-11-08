from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Notification



class NotificationsSerializer(serializers.ModelSerializer):
    created = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ("id", "content", "heading", "read", "created")
        read_only_fields = ("id", "created",)

    def get_created(self, obj):
        return naturaltime(obj.created_at)