from datetime import timedelta
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed


class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        user, token  = super().authenticate_credentials(key)

        expiry_time  = token.created + timedelta (hours=2)
        if timezone.now() > expiry_time:
            token.delete()
            raise AuthenticationFailed("Token has expired. Please log in Again.")

        return (user, token)