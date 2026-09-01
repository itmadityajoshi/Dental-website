from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from rest_framework.decorators import api_view, throttle_classes
from .authentication import LoginRateThrottle

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_staff": user.is_staff,
    })

@api_view(['POST'])
def register(request):
    serilazer = RegisterSerializer(data=request.data)
    if serilazer.is_valid():
        serilazer.save()
        return Response(serilazer.data, status=status.HTTP_201_CREATED)
    return Response(serilazer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@throttle_classes([LoginRateThrottle])
def login (request):
    # print("RECEIVED DATA:", request.data)  # temporary debug line
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({"detail":"Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

    token, created = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})


token_generator = PasswordResetTokenGenerator()

@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email', '').strip()
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "If that email exists, a reset link has been sent."})

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = token_generator.make_token(user)
    reset_link = f"http://127.0.0.1:8000/api/accounts/reset-password-confirm/?uid={uid}&token={token}"

    send_mail(
        subject="Password Reset - Dental Clinic",
        message=f"Click here to reset your password: {reset_link}",
        from_email='noreply@dentalsite.com',
        recipient_list=[email],
    )

    return Response({"detail": "If that email exists, a reset link has been sent."})


@api_view(['POST'])
def reset_password_confirm(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    if not uid or not token or not new_password:
        return Response({"detail": "uid, token, and new_password are all required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (User.DoesNotExist, ValueError, TypeError, OverflowError):
        return Response({"detail": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

    if not token_generator.check_token(user, token):
        return Response({"detail": "This reset link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 8:
        return Response({"detail": "Password must be at least 8 characters."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"detail": "Password has been reset successfully."})