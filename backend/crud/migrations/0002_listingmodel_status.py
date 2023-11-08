# Generated by Django 3.2 on 2023-04-20 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crud', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='listingmodel',
            name='status',
            field=models.CharField(blank=True, choices=[('pending', 'pending'), ('denied', 'denied'), ('approved', 'approved'), ('expired', 'expired'), ('pending cancellation', 'pending cancellation'), ('canceled', 'canceled'), ('terminated', 'terminated'), ('completed', 'completed')], default='available', max_length=20, null=True),
        ),
    ]