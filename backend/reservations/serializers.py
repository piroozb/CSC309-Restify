from account.models import UserProfile
from rest_framework import serializers
from .models import Reservations
from django.utils.timezone import now

class ReservationSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=Reservations.STATUS)

    class Meta:
        model = Reservations
        fields = '__all__'
        read_only_fields = ['id', 'host', 'guest', 'status', 'reserved_at'] 

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context['request'].method == 'POST':
            self.fields['status'] = serializers.CharField(required=False)
        if self.context['request'].method == 'PUT':
            self.fields['status'] = serializers.CharField(required=False)
            self.fields['reserved_from'] = serializers.DateField(required=False)
            self.fields['reserved_to'] = serializers.DateField(required=False)
            self.fields['num_guests'] = serializers.IntegerField(required=False)
            self.fields['property'] = serializers.CharField(required=False)
            self.fields['approve_in'] = serializers.IntegerField(required=False)

    def create(self, validated_data):
        property = validated_data.get('property')
        validated_data['host'] = property.created_user
        validated_data['status'] = 'pending'
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.fields['property'].read_only = True
        self.fields['approve_in'].read_only = True
        user = self.context['request'].user
        if user == instance.guest:
            status = validated_data.get('status')
            if status:
                status = status.lower()
            if status == 'pending':
                instance.status = 'pending'
                instance.save()
            elif status == 'request cancellation' and instance.status == 'approved':
                instance.status = 'pending cancellation'
                instance.save()
            if status == 'expired':
                instance.save()
        elif user == instance.host:
            status = validated_data.get('status')
            if status == 'approved' and instance.status == 'pending':
                instance.status = 'approved'
                instance.save()
            if status == 'denied' and instance.status == 'pending':
                instance.status = 'denied'
                instance.save()
            if status == 'terminated' and instance.status == 'approved':
                instance.status = 'terminated'
                instance.save()
            if instance.status=='pending cancellation' and status == 'pending':
                instance.status = 'pending'
                instance.save()
            if status == 'canceled' and instance.status == 'pending cancellation':
                instance.status = 'canceled'
                instance.save()
            if status == 'expired':
                instance.save()
        else:
            raise serializers.ValidationError('Unauthorized', status=401)
        return instance