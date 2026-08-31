from django.db import models

# Create your models here.


class Dentist(models.Model):
    name = models.CharField(max_length=50)
    specialization = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="dentist_photo/", blank=True, null=True)
    working_start = models.TimeField(default='09:00')
    working_end = models.TimeField(default='17:00')

    def __str__(self):
        return self.name


class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=30)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.name
