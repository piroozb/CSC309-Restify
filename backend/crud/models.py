from django.db import models
# from reservations.models import Reservations
from django.contrib.auth import get_user_model
User = get_user_model()


class ListingModel(models.Model):
    rating_status = (
        ("0", "0"),
        ("1", "1"),
        ("2", "2"),
        ("3", "3"),
        ("4", "4"),
        ("5", "5"),
    )
    STATUS = [
        ('pending', 'pending'),
        ('approved', 'approved'),
        ('pending cancellation', 'pending cancellation'),
        ('available', 'available')
    ]
    created_user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=155)
    amentites = models.CharField(max_length=155)
    available_start = models.DateField()
    available_end = models.DateField()
    number_of_guests = models.IntegerField()
    location = models.CharField(max_length=155)
    price_per_day = models.FloatField()
    number_of_washroom = models.IntegerField()
    number_of_bedroom = models.IntegerField()
    rating = models.CharField(choices=rating_status, max_length=1, default="0")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField()
    reservation = models.ManyToManyField('reservations.Reservations', related_name='reservation', blank=True, null=True)
    
    def __str__(self):
        return str(self.id)

class Image(models.Model):
    listing = models.ForeignKey(ListingModel, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to ='uploads/')