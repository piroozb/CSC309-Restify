from django.db import models
from account.models import UserProfile
from crud.models import ListingModel
from django.core.validators import MinValueValidator, MaxValueValidator

RATING = [tuple([x,x]) for x in range(1,6)]

class Comment(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    text = models.TextField()
    created_date = models.DateField(auto_now=True)

    class Meta:
        abstract = True

class CommentUser(Comment):
    rating = models.IntegerField(choices=RATING, default=1)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='comment_set')

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.text

class CommentListing(Comment):
    rating = models.IntegerField(choices=RATING, default=1)
    listing = models.ForeignKey(ListingModel, on_delete=models.CASCADE, related_name='comment_set')

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.text
    
class Reply(Comment):
    reply_to = models.ForeignKey(CommentListing, on_delete=models.SET_NULL, related_name="replies", null=True)

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.text

