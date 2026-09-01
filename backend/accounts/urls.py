from django.urls import path
from . import views
urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('user/', views.get_user, name='get-user'),
    path('request-password-reset/', views.request_password_reset, name='request-password-reset'),
    path('reset-password-confirm/', views.reset_password_confirm, name='reset-password-confirm'),
]
