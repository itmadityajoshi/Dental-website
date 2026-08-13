from django.db import models
from django.conf import settings
from clinic.models import Dentist, Service

# Create your models here.


class Appointment(models.Model):
    STATUS_CHOICE = [
        ("pending", "pending"),
        ("confirmed", "confirmed"),
        ("cancelled", "cancelled"),
        ("completed", "completed"),
    ]

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appointments"
    )
    dentist = models.ForeignKey(
        Dentist, on_delete=models.CASCADE, related_name="appointments"
    )
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, null=True, blank=True
    )
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICE, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "time"]

    def __str__(self):
        return f"{self.patient} with {self.dentis} on {self.date} at {self.time}"
