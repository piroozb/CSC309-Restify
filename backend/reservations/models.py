from django.db import models
from account.models import UserProfile
from crud.models import ListingModel
from django.utils.timezone import now
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class Reservations(models.Model):
    STATUS = [
        ('pending', 'pending'),
        ('denied', 'denied'),
        ('approved', 'approved'),
        ('expired', 'expired'),
        ('pending cancellation', 'pending cancellation'),
        ('canceled', 'canceled'),
        ('terminated', 'terminated'),
        ('completed', 'completed')
    ]
    property = models.ForeignKey(ListingModel, on_delete=models.CASCADE, related_name='reservation_set', null=False, blank=False)
    status = models.CharField(choices=STATUS, max_length=20, default='pending', blank=True, null=True)
    host = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='host')
    guest = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='guest')
    reserved_from = models.DateField(null=False, blank=False)
    reserved_to = models.DateField(null=False, blank=False)
    num_guests = models.IntegerField(null=False, blank=False)
    approve_in = models.IntegerField(null=False, blank=False)
    reserved_at = models.DateField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.id}"
    
    def save(self, *args, **kwargs) -> None:
        if self.reserved_at is not None and self.reserved_from is not None and self.approve_in is not None:
            if self.status == 'pending' and ((now().date() - self.reserved_at).days > self.approve_in):
                self.status = 'expired'
        if self.reserved_from is not None:
            if self.status == 'approved' and now().date() >= self.reserved_from:
                self.status = 'completed'
        return super().save(*args, **kwargs)
    

@receiver(post_save, sender=Reservations)
def update_listing_status(sender, instance, **kwargs):
    if instance.property.reservation is None:
        instance.property.reservation.set([instance])
    else:
        instance.property.reservation.add(instance)
    instance.property.save()
    

    