from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterSerializer


# Create your views here.

@api_view(['POST'])
def register(request):
    serilazer = RegisterSerializer(data=request.data)
    if serilazer.is_valid():
        serilazer.save()
        return Response(serilazer.data, status=status.HTTP_201_CREATED)
    return Response(serilazer.errors, status=status.HTTP_400_BAD_REQUEST)