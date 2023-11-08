from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


class CustomJWTSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        credentials = {
            'username': '',
            'password': attrs.get("password")
        }
        User = get_user_model()
        user_obj =  User.objects.filter(username=attrs.get("username")).first()

        if user_obj:
            credentials['username'] = user_obj.username
            
            return super().validate(credentials)

        return super().validate(credentials)



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id','profile_picture', 'email', 'username',"phone_number", 'first_name', 'last_name', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }
    

    def create(self, validated_data):
        user = get_user_model().objects.create(**validated_data)

        # add group
        user_group, _ = Group.objects.get_or_create(name="Guest")
        user.groups.add(user_group)
        return user


