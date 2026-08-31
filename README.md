# Dental Clinic Application

A full-stack dental clinic management system with Django REST API backend and React frontend.

## Project Structure

```
DentalSite/
├── backend/                    # Django REST Framework API
│   ├── Dental_clinic/         # Main project settings
│   ├── accounts/              # User authentication
│   ├── appointments/          # Appointment management
│   ├── clinic/                # Clinic and dentist info
│   ├── dashboard/             # Dashboard functionality
│   ├── manage.py
│   ├── db.sqlite3
│   ├── requirements.txt
│   └── README.md
├── frontend/                   # React + Vite + Tailwind CSS
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
├── .gitignore
└── README.md                   # This file
```

## Prerequisites

- **Python 3.8+** (for Django backend)
- **Node.js 16+** (for React frontend)
- **npm** or **yarn** (Node package manager)

## Quick Start

### 1. Backend Setup (Django)

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### 2. Frontend Setup (React)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Development Workflow

### Running Both Services Simultaneously

**Terminal 1 - Backend:**

```bash
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
python manage.py runserver
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Default Configuration

- Backend URL: `http://localhost:8000`
- Frontend URL: `http://localhost:5173`
- API Base URL: `http://localhost:8000/api`

The frontend is configured to connect to the backend API automatically.

## Features

### Backend (Django)

- User authentication and authorization
- Appointment management
- Clinic and dentist information
- Dashboard with statistics
- REST API with proper serialization
- CORS enabled for frontend communication

### Frontend (React)

- Modern UI with Tailwind CSS
- Responsive design
- API integration with axios
- React Router for navigation
- Modular component structure
- Environment variable configuration

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication

Include token in header:

```
Authorization: Bearer <token>
```

### Main Endpoints

**Accounts:**

- `POST /accounts/login/` - User login
- `POST /accounts/register/` - User registration
- `GET /accounts/profile/` - Get user profile
- `PUT /accounts/profile/` - Update profile

**Clinic:**

- `GET /clinic/dentists/` - List all dentists
- `GET /clinic/dentists/{id}/` - Get dentist details

**Appointments:**

- `GET /appointments/` - List user's appointments
- `POST /appointments/` - Create appointment
- `GET /appointments/{id}/` - Get appointment details
- `PUT /appointments/{id}/` - Update appointment
- `DELETE /appointments/{id}/` - Delete appointment

**Dashboard:**

- `GET /dashboard/` - Dashboard data
- `GET /dashboard/stats/` - Statistics

For more details, see:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## Building for Production

### Backend

```bash
cd backend
# Set DEBUG=False in settings.py
# Collect static files
python manage.py collectstatic --noinput
# Run with production server (gunicorn, etc.)
```

### Frontend

```bash
cd frontend
# Build optimized production bundle
npm run build
# Output is in dist/ folder
```

## Environment Variables

### Backend (.env in backend folder)

```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=sqlite:///db.sqlite3
```

### Frontend (.env.local in frontend folder)

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Dental Clinic
```

## Troubleshooting

### CORS Errors

- Ensure `CORS_ALLOWED_ORIGINS` in Django settings includes your frontend URL
- Default: `http://localhost:5173`

### Connection Issues

- Verify both services are running
- Check firewall settings
- Ensure ports 8000 and 5173 are not in use

### Database Errors

- Run migrations: `python manage.py migrate`
- Check database file permissions

## Technologies Used

### Backend

- Django 6.1
- Django REST Framework
- Django CORS Headers
- SQLite (development)
- Python-dotenv

### Frontend

- React 18+
- Vite
- Tailwind CSS
- React Router
- Axios
- ESLint

## Git Workflow

```bash
# Clone repository
git clone <repository-url>
cd DentalSite

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to repository
git push origin feature/your-feature-name
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue on GitHub or contact the development team.
