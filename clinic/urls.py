from django.urls import path
from . import views

urlpatterns = [
    path("dentists/", views.dentist_list, name="dentist_list"),
    path("dentists/<int:pk>/", views.dentist_detail, name="dentist_detail"),
    path("services/", views.service_list, name="service_list"),
    path('dentists/<int:pk>/available-slots/', views.available_slots, name='available-slots'),
]
