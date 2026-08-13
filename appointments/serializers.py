from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        field = ["id", "patient", "service", "date", "time", "status", "created_at"]
        read_only_fields = ["status", "created_at"]
