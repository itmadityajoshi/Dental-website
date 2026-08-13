from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer

# Create your views here.


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def appointment_list(request):
    if request.uesr.is_staff:
        appointments = Appointment.objects.all()
    else:
        appointments = Appointment.objects.filter(patient=request.user)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def appointment_create(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(patient=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
