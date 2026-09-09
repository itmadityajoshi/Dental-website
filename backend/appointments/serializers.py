from rest_framework import serializers
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Appointment
from clinic.serializers import DentistSerializer, ServiceSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    dentist_detail = DentistSerializer(source='dentist', read_only=True)
    service_detail = ServiceSerializer(source='service', read_only=True)
    patient_name = serializers.SerializerMethodField()
    patient_id = serializers.IntegerField(source='patient.id', read_only=True)
    patient_email = serializers.EmailField(source='patient.email', read_only=True)
    dentist_name = serializers.CharField(source='dentist.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    appointment_date = serializers.CharField(source='date', read_only=True)
    appointment_time = serializers.CharField(source='time', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ["patient", "status", "created_at"]

    def get_patient_name(self, appointment):
        full_name = f"{appointment.patient.first_name} {appointment.patient.last_name}".strip()
        return full_name or appointment.patient.email


    def validate_date(self, value): # it will prevent from booking an appointment from the past date.
        if value < timezone.now().date():
            raise serializers.ValidationError("Appointment date cannot be in the past. ")
        return value

    def validate(self, data):
        dentist = data.get('dentist')
        date = data.get('date')
        time = data.get('time')

        if not dentist or not date or not time:
            return data

        if dentist.working_start >= dentist.working_end:
            raise serializers.ValidationError("The dentist's working hours are not configured correctly.")

        if time < dentist.working_start or time >= dentist.working_end:
            raise serializers.ValidationError("Appointment time must be within the dentist's working hours.")

        if date == timezone.localdate() and time <= timezone.localtime().time().replace(microsecond=0):
            raise serializers.ValidationError("Appointment time must be in the future.")

        duration = data.get('service').duration_minutes if data.get('service') else 30
        appointment_start = datetime.combine(date, time)
        appointment_end = appointment_start + timedelta(minutes=duration)
        working_end = datetime.combine(date, dentist.working_end)
        if appointment_end > working_end:
            raise serializers.ValidationError("The appointment must finish within the dentist's working hours.")

        conflict = Appointment.objects.filter(
            dentist=dentist,
            date=date,
        ).exclude(status='cancelled')

        for existing in conflict:
            existing_duration = existing.service.duration_minutes if existing.service else 30
            existing_start = datetime.combine(existing.date, existing.time)
            existing_end = existing_start + timedelta(minutes=existing_duration)
            if appointment_start < existing_end and appointment_end > existing_start:
                raise serializers.ValidationError("This dentist is already booked during that time.")

        return data