from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer

# Create your views here.


@api_view(["GET"])
@permission_classes([IsAuthenticated])   #control who's allowed to even reach this function 
def appointment_list(request):
    if request.user.is_staff: # checks whether the logged-in user is marked staff in the database.
        appointments = Appointment.objects.all()
    else:
        appointments = Appointment.objects.filter(patient=request.user)  # check if they are regular patient and only grab their appointments
    serializer = AppointmentSerializer(appointments, many=True) # takes whichever queryset got selected above and converts it into json ready-data
    return Response(serializer.data) #send that JSON back to whoeve called the endppoint.


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def appointment_create(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(patient=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cancel_appointment(request,pk):
    try:
        appointment = get_object_or_404(Appointment, pk=pk)
    except Appointment.DoesNotExist:
        return Response({"detail": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)

    if appointment.patient != request.user and not request.user.is_staff:
        return Response({"detail":"You do not have permission to cancel this appointment."}, status=status.HTTP_403_FORBIDDEN)

    if appointment.status == "completed":
        return Response({"detail":"Cannot cancel a completed appointment."}, status=status.HTTP_404_NOT_FOUND)

    appointment.status = 'cancelled'
    appointment.save()
    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)