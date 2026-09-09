from datetime import date, time, timedelta

from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import User
from clinic.models import Dentist, Service
from .models import Appointment


class AppointmentApiTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			email='patient@example.com',
			password='StrongPassword123',
			first_name='Test',
			last_name='Patient',
		)
		self.dentist = Dentist.objects.create(
			name='Dr. Test',
			working_start=time(9, 0),
			working_end=time(17, 0),
		)
		self.service = Service.objects.create(
			name='Long cleaning',
			duration_minutes=60,
			price='100.00',
		)
		self.client.force_authenticate(self.user)
		self.appointment_date = date.today() + timedelta(days=7)

	def appointment_payload(self, appointment_time='10:00'):
		return {
			'dentist': self.dentist.id,
			'service': self.service.id,
			'date': self.appointment_date.isoformat(),
			'time': appointment_time,
		}

	def test_create_rejects_overlapping_service_duration(self):
		Appointment.objects.create(
			patient=self.user,
			dentist=self.dentist,
			service=self.service,
			date=self.appointment_date,
			time=time(10, 0),
		)

		response = self.client.post(reverse('appointment_create'), self.appointment_payload('10:30'))

		self.assertEqual(response.status_code, 400)
		self.assertIn('already booked', str(response.data))

	def test_create_rejects_time_outside_working_hours(self):
		response = self.client.post(reverse('appointment_create'), self.appointment_payload('17:00'))

		self.assertEqual(response.status_code, 400)
		self.assertIn('working hours', str(response.data))

	def test_cancel_requires_patch_and_is_scoped_to_patient(self):
		appointment = Appointment.objects.create(
			patient=self.user,
			dentist=self.dentist,
			service=self.service,
			date=self.appointment_date,
			time=time(10, 0),
		)

		get_response = self.client.get(reverse('cancel-appointment', args=[appointment.id]))
		patch_response = self.client.patch(reverse('cancel-appointment', args=[appointment.id]))

		self.assertEqual(get_response.status_code, 405)
		self.assertEqual(patch_response.status_code, 200)
		self.assertEqual(patch_response.data['status'], 'cancelled')
