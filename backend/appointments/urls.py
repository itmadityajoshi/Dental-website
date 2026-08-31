from django.urls import path
from . import views

urlpatterns = [
    path("", views.appointment_list, name="appointment_list"),
    path("create/", views.appointment_create, name="appointment_create"),
    path('<int:pk>/cancel/', views.cancel_appointment, name='cancelled-appointment')
]
