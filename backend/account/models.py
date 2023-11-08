from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
import re
from django.core.exceptions import ValidationError


class CustomUserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        user = self.model(**extra_fields)
        user.username = username
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, **extra_fields):
        """
        Creates and saves a superuser with the given.
        """
        user = self.create_user(
            username,
            password
        )
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


def validate_phone_number(value):
    regex = r'^\+?1?\d{9,15}$'
    if not re.match(regex, value):
        raise ValidationError('Invalid phone number.')



class UserProfile(AbstractUser):
    profile_picture = models.ImageField(upload_to="profile_picures", blank=True, null=True)
    phone_number = models.CharField(max_length=17, validators=[validate_phone_number], blank=True, null=True)
    objects = CustomUserManager()
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username