# Dental Clinic Backend - Django REST API

A comprehensive REST API for dental clinic management built with Django and Django REST Framework.

## Project Structure

```
backend/
├── Dental_clinic/           # Main Django project settings
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── accounts/                # User authentication app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── migrations/
├── appointments/            # Appointment management app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── migrations/
├── clinic/                  # Clinic and dentist info app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── migrations/
├── dashboard/               # Dashboard functionality
│   ├── models.py
│   ├── views.py
│   └── migrations/
├── dentist_photo/           # Dentist photos storage
├── db.sqlite3              # SQLite database (development)
├── manage.py
├── requirements.txt
└── README.md               # This file
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the backend folder:

```
DEBUG=True
SECRET_KEY=django-insecure-your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
DATABASE_URL=sqlite:///db.sqlite3
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

### 6. Start Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## Apps Overview

### Accounts App

User authentication and profile management.

**Models:**

- User (custom user model or Django's default)

**Endpoints:**

- `POST /api/accounts/login/` - User login
- `POST /api/accounts/register/` - User registration
- `GET /api/accounts/profile/` - Get authenticated user's profile
- `PUT /api/accounts/profile/` - Update user profile
- `POST /api/accounts/logout/` - Logout user

**Key Files:**

- [models.py](./accounts/models.py) - User model definition
- [views.py](./accounts/views.py) - Authentication logic
- [serializers.py](./accounts/serializers.py) - Data serialization

### Clinic App

Dentist and clinic information management.

**Models:**

- Dentist - Information about clinic dentists

**Endpoints:**

- `GET /api/clinic/dentists/` - List all dentists
- `GET /api/clinic/dentists/{id}/` - Get single dentist
- `POST /api/clinic/dentists/` - Create dentist (admin only)
- `PUT /api/clinic/dentists/{id}/` - Update dentist (admin only)
- `DELETE /api/clinic/dentists/{id}/` - Delete dentist (admin only)

**Key Files:**

- [models.py](./clinic/models.py) - Dentist model
- [views.py](./clinic/views.py) - Dentist views
- [serializers.py](./clinic/serializers.py) - Data serialization

### Appointments App

Appointment booking and management.

**Models:**

- Appointment - User appointment bookings

**Endpoints:**

- `GET /api/appointments/` - List user's appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/{id}/` - Get appointment details
- `PUT /api/appointments/{id}/` - Update appointment
- `DELETE /api/appointments/{id}/` - Delete appointment

**Key Files:**

- [models.py](./appointments/models.py) - Appointment model
- [views.py](./appointments/views.py) - Appointment logic
- [serializers.py](./appointments/serializers.py) - Data serialization

### Dashboard App

Dashboard statistics and analytics.

**Endpoints:**

- `GET /api/dashboard/` - Dashboard main data
- `GET /api/dashboard/stats/` - Statistics and metrics

**Key Files:**

- [views.py](./dashboard/views.py) - Dashboard views

## API Response Format

### Success Response

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Dr. John Doe",
    ...
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

## Authentication

### Token-Based Authentication

1. Get token via login:

```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

2. Use token in headers:

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/appointments/
```

## CORS Configuration

CORS is enabled for frontend communication. Update `CORS_ALLOWED_ORIGINS` in `.env`:

```
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomain.com
```

## Database

### Current: SQLite (Development)

- File: `db.sqlite3`
- Perfect for development and testing

### Production: Recommended PostgreSQL

- Update `DATABASE_URL` in `.env`
- Install: `pip install psycopg2-binary`
- Example: `DATABASE_URL=postgresql://user:password@localhost:5432/dental_clinic`

## Running Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test accounts

# With coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## Management Commands

```bash
# Create superuser
python manage.py createsuperuser

# Apply migrations
python manage.py migrate

# Make migrations
python manage.py makemigrations

# Collect static files (production)
python manage.py collectstatic --noinput

# Shell (interactive Django shell)
python manage.py shell
```

## Admin Interface

Access admin panel at: `http://localhost:8000/admin`

Login with superuser credentials created during setup.

## Common Issues

### Migration Errors

```bash
# Reset migrations (development only)
python manage.py migrate zero
python manage.py migrate
```

### Database Locked

```bash
# Remove old database and restart
rm db.sqlite3
python manage.py migrate
```

### Port Already in Use

```bash
# Use different port
python manage.py runserver 8001
```

## Performance Optimization

- Add database indexes for frequently queried fields
- Implement pagination for list endpoints
- Use select_related() and prefetch_related() for queries
- Cache frequently accessed data
- Use pagination with limit/offset

## Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False in production
- [ ] Use environment variables for sensitive data
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input validation on all endpoints
- [ ] Use strong password policies
- [ ] Regular security audits

## Deployment

### Using Gunicorn and Nginx

1. Install production dependencies:

```bash
pip install gunicorn
```

2. Run with Gunicorn:

```bash
gunicorn Dental_clinic.wsgi:application --bind 0.0.0.0:8000
```

3. Configure Nginx as reverse proxy
4. Set DEBUG=False
5. Collect static files

## Useful Resources

- [Django Documentation](https://docs.djangoproject.com)
- [Django REST Framework](https://www.django-rest-framework.org)
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [Database Optimization](https://docs.djangoproject.com/en/stable/topics/db/optimization/)

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, contact the development team.
