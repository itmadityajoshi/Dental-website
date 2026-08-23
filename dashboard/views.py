from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import  status
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer 
from django.shortcuts import render, get_object_or_404

# Create your views here.


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_appointment_status(request,pk):
    try:
        appointment = get_object_or_404(Appointment, pk=pk)
    except Appointment.DoesNotExist:
        return Response({"detail":"Appointment not found."}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    valid_status = ['pending','confirmed','cancelled','completed']

    if new_status not in valid_status:
        return Response({"detail":f"Status must be one of the {valid_status}"}, status=status.HTTP_400_BAD_REQUEST)

    appointment.status= new_status
    appointment.save()

    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)


#sorting the appointments 
@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_appointments(request):
    appointments = Appointment.objects.all().order_by('date','time')
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)
