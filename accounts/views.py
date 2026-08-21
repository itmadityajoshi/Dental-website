from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

# Create your views here.

@api_view(['POST'])
def register(request):
    serilazer = RegisterSerializer(data=request.data)
    if serilazer.is_valid():
        serilazer.save()
        return Response(serilazer.data, status=status.HTTP_201_CREATED)
    return Response(serilazer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login (request):
    print("RECEIVED DATA:", request.data)  # temporary debug line
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({"detail":"Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

    token, created = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})