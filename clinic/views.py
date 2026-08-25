from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Dentist, Service
from .serializers import DentistSerializer, ServiceSerializer
from datetime import datetime, timedelta
from appointments.models import Appointment

# Create your views here.


@api_view(["GET","POST"])
def dentist_list(request):
    if request.method == 'GET':
        dentists = Dentist.objects.all()
        serializer = DentistSerializer(dentists, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"detail":"Only staff  can add dentists."}, status=status.HTTP_403_FORBIDDEN)
        serializer = DentistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET",'PUT','DELETE'])
def dentist_detail(request, pk):
    try:
      dentist = Dentist.objects.get(pk=pk)
    except Dentist.DoesNotExist:
        return Response({"detail":"Dentist not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DentistSerializer(dentist)
        return Response(serializer.data)

    if request.user.is_authenticated or not request.user.is_staff:
        return Response({"detail":"Only staff can modify dentists."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        serializer = DentistSerializer(dentist, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        dentist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def service_list(request):
    if request.method == 'GET':
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"detail": "Only staff can add services."}, status=status.HTTP_403_FORBIDDEN)
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def service_detail(request, pk):
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({"detail": "Only staff can modify services."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def available_slots(request, pk):
    try:
        dentist = Dentist.objects.get(pk=pk)
    except Dentist.DoesNotExist:
        return Response({"detail": "Dentist not found."}, status=status.HTTP_404_NOT_FOUND)

    date_str = request.query_params.get('date')
    if not date_str:
        return Response({"detail": "A 'date' query parameter is required, e.g. ?date=2026-09-01"}, status=status.HTTP_400_BAD_REQUEST)

    booked = Appointment.objects.filter(dentist=dentist, date=date_str).exclude(status='cancelled')

    booked_ranges = []
    for appt in booked:
        duration = appt.service.duration_minutes if appt.service else 30
        start_dt = datetime.combine(appt.date, appt.time)
        end_dt = start_dt + timedelta(minutes=duration)
        booked_ranges.append((start_dt, end_dt))

    slots = []
    slot_length = timedelta(minutes=30)
    current = datetime.combine(datetime.strptime(date_str, '%Y-%m-%d').date(), dentist.working_start)
    end_of_day = datetime.combine(datetime.strptime(date_str, '%Y-%m-%d').date(), dentist.working_end)

    while current < end_of_day:
        slot_end = current + slot_length
        overlaps = any(current < b_end and slot_end > b_start for b_start, b_end in booked_ranges)
        if not overlaps:
            slots.append(current.time().strftime('%H:%M'))
        current = slot_end

    return Response({"date": date_str, "available_slots": slots})