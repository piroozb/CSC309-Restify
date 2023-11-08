from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from notifications.models import Notification
from django.contrib.auth import get_user_model
from crud.models import ListingModel
from reservations.models import Reservations

User = get_user_model()


@receiver(post_save, sender=User)
def user(sender, instance, created, **kwargs):
    if created:
        # first time user is created

        # create notification
        Notification.objects.create(user=instance, heading="Account Created", content="Your account has been created successfully")
    else:
        # when user info is updated
        Notification.objects.create(user=instance, heading="Account Info updated", content="Your account has been updated successfully")
    

@receiver(post_save, sender=ListingModel)
def listing(sender, instance, created, **kwargs):
    if created:
        # first listing is created

        # create notification
        Notification.objects.create(user=instance.created_user, heading="Listing Created", content="Your Liting has been created successfully")
    else:
        # when listing info is updated
        Notification.objects.create(user=instance.created_user, heading="Listing updated", content="Your listing has been updated successfully")


@receiver(post_delete, sender=ListingModel)
def listing_delete(sender, instance, **kwargs):
        Notification.objects.create(user=instance.created_user, heading="Listing deleted", content="Your listing has been deleted successfully")



@receiver(post_save, sender=Reservations)
def reservation_created(sender, instance, created, **kwargs):
    if created:
        # create notification
        Notification.objects.create(user=instance.host, heading="Reservation Created", content="Your Reservation has been created successfully")



@receiver(pre_save, sender=Reservations)
def reservation_updated(sender, instance, **kwargs):
         if instance.pk:
            prev_instance = sender.objects.get(pk=instance.pk)
            
            # check if preservation has been approved
            if prev_instance.status == "pending" and instance.status == "approved":
                Notification.objects.create(user=instance.guest, heading="Reservation Approved", content="Your Reservation has been approved")

            # check if preservation has been rejected
            if prev_instance.status != "canceled" and instance.status == "canceled":
                Notification.objects.create(user=instance.guest, heading="Reservation Canceled", content="Your Reservation has been Canceled")

                # create notificaiton for host
                Notification.objects.create(user=instance.host, heading="Reservation Canceled", content="A Reservation has been Canceled")
