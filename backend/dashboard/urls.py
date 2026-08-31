from django.urls import path
from . import views

urlpatterns = [
    path('appointment/<int:pk>/status/', views.update_appointment_status, name='update-appointment-status'),
    path('appointments/', views.dashboard_appointments, name='dashboard-appointments')
]
