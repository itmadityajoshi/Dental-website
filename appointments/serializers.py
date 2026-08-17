from rest_framework import serializers
from django.utils import timezone
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ["patient","status", "created_at"]


    def validate_date(self, value): # it will prevent from booking an appointment from the past date.
        if value < timezone.now().date():
            raise serializers.ValidationError("Appointment date cannot be in the past. ")
        return value