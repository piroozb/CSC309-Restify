from account.models import UserProfile
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Comment, CommentUser, CommentListing, Reply

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), queryset=UserProfile.objects.all())

    class Meta:
        model = Comment
        fields = ('author', 'text', 'rating', 'created_date', 'id')
        read_only_fields = ("author", "created_date", 'id')
        abstract = True

class CommentUserSerializer(CommentSerializer):
    class Meta:
        model = CommentUser
        fields = ('user', 'author', 'text', 'rating', 'created_date', 'id')
        read_only_fields = ("user", "author", "created_date", 'id')
    
    def create(self, validated_data):
         user = self.context['user']
         return CommentUser.objects.create(user=user, **validated_data)

class CommentListingSerializer(CommentSerializer):
    class Meta:
        model = CommentListing
        fields = ('listing', 'author', 'text', 'rating', 'created_date', 'id')
        read_only_fields = ('listing', "author", "created_date", 'id')

    def create(self, validated_data):
         listing = self.context['listing']
         return CommentListing.objects.create(listing=listing, **validated_data)
    
class ReplySerializer(CommentSerializer):
    
    class Meta:
        model = Reply
        fields = ('author', 'text', 'created_date', 'reply_to')
        read_only_fields = ("author", "created_date", "reply_to")

    def create(self, validated_data):
         reply_to = self.context['reply_to']
         return Reply.objects.create(reply_to=reply_to, **validated_data)