from django.contrib import admin
from .models import ListingModel, Image

class ImageAdmin(admin.StackedInline):
    model = Image

class ListingAdmin(admin.ModelAdmin):
    inlines = [ImageAdmin]

    class Meta:
        model = ListingModel

# Register your models here.
admin.site.register(Image)
admin.site.register(ListingModel, ListingAdmin)