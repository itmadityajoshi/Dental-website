from django.contrib import admin
from .models import Dentist, Service

# Register your models here.


@admin.register(Dentist)
class DentistAdmin(admin.ModelAdmin):
    pass


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    pass
