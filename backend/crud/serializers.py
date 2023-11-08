from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import ListingModel, Image
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ListingModelSerializer(ModelSerializer):
    class Meta:
        model = ListingModel
        fields = '__all__'


class ListingSerializer(ModelSerializer):
    class Meta:
        model = ListingModel
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user_created_info'] = UserSerializer(instance.created_user).data
        return response
    
class ImageSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
        






