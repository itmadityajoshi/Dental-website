from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Dentist, Service
from .serializers import DentistSerializer, ServiceSerializer

# Create your views here.


@api_view(["GET"])
def dentist_list(request):
    dentists = Dentist.objects.all()
    serializer = DentistSerializer(dentists, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def dentist_detail(request, pk):
    dentist = Dentist.objects.get(pk=pk)
    serializer = DentistSerializer(dentist)
    return Response(serializer.data)


@api_view({"GET"})
def service_list(request):
    services = Service.objects.all()
    serialzer = ServiceSerializer(services, many=True)
    return Response(serialzer.data)
