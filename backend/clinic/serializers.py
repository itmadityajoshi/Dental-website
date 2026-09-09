from rest_framework import serializers
from .models import Dentist, Service

class DentistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dentist
        fields = ['id','name','specialization','bio','photo','working_start','working_end']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id','name','description','duration_minutes','price']

    def validate_duration_minutes(self, value):
        if value < 1:
            raise serializers.ValidationError("Duration must be at least one minute.")
        return value