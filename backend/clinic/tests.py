from datetime import time
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import User

from .models import Dentist


class AvailabilityApiTests(APITestCase):
	def test_invalid_date_returns_bad_request(self):
		dentist = Dentist.objects.create(
			name='Dr. Test',
			working_start=time(9, 0),
			working_end=time(17, 0),
		)

		response = self.client.get(
			reverse('available-slots', args=[dentist.id]),
			{'date': 'not-a-date'},
		)

		self.assertEqual(response.status_code, 400)


class DentistUpdateApiTests(APITestCase):
	def setUp(self):
		self.staff = User.objects.create_user(
			email='staff@example.com',
			password='StrongPassword123',
			is_staff=True,
		)
		self.dentist = Dentist.objects.create(
			name='Dr. Old Name',
			specialization='General Dentistry',
			working_start=time(9, 0),
			working_end=time(17, 0),
		)
		self.client.force_authenticate(self.staff)

	def test_staff_can_update_dentist_with_multipart_put(self):
		photo = SimpleUploadedFile(
			'dentist.png',
			(
				b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
				b'\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89'
				b'\x00\x00\x00\rIDAT\x08\xd7c\xf8\xcf\xc0\xf0\x1f\x00\x05\x00\x01\xff'
				b'\x89\x99=\x1d\x00\x00\x00\x00IEND\xaeB`\x82'
			),
			content_type='image/png',
		)
		response = self.client.put(
			reverse('dentist_detail', args=[self.dentist.id]),
			{
				'name': 'Dr. Updated Name',
				'specialization': 'Orthodontics',
				'bio': 'Updated biography',
				'working_start': '10:00',
				'working_end': '18:00',
				'photo': photo,
			},
			format='multipart',
		)

		self.assertEqual(response.status_code, 200)
		self.dentist.refresh_from_db()
		self.assertEqual(self.dentist.name, 'Dr. Updated Name')
		self.assertEqual(self.dentist.specialization, 'Orthodontics')
		self.assertTrue(self.dentist.photo.name)
