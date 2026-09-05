from rest_framework import serializers
from django.utils import timezone
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

    def validate(self, data):  #this validation fun controls all the cancelled appointment as it takes all the data in dic form and compare to for the empty solts so the previous booked date are not occupied.
        dentist = data.get('dentist')
        date = data.get('date')
        time = data.get('time')

        conflict = Appointment.objects.filter(
            dentist = dentist,
            date =date,
            time=time
        ).exclude(status='cancelled')

        if conflict.exists():
            raise serializers.ValidationError("This dentist is already booked at that date.")
        return data