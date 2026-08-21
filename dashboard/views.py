from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import  status
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer 
from django.shortcuts import render

# Create your views here.


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_appointment_status(request,pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"detail":"Appointment not found."}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    valid_status = ['pending','confirmed','cancelled','completed']

    if new_status not in valid_status:
        return Response({"detail":f"Status must be one of the {valid_status}"}, status=status.HTTP_400_BAD_REQUEST)

    appointment.status= new_status
    appointment.save()

    serializer = AppointmentSerializer(appointment)
    return Response
