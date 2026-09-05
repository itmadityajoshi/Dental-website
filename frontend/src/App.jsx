import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Navbar from "./components/Navbar";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Patient Pages
import DashboardPage from "./pages/DashboardPage";
import DentistsPage from "./pages/DentistsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import AppointmentDetailsPage from "./pages/AppointmentDetailsPage";
import PublicHomePage from "./pages/PublicHomePage";

// Staff Pages
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffAppointments from "./pages/staff/StaffAppointments";
import StaffDentists from "./pages/staff/StaffDentists";
import StaffServices from "./pages/staff/StaffServices";
import StaffPatients from "./pages/staff/StaffPatients";
import StaffAdminDashboard from "./pages/staff/StaffAdminDashboard";
import { useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const isPublicRoute = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!isPublicRoute && <Navbar />}
      <div className={user && !isPublicRoute ? "md:pl-64" : ""}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<PublicHomePage />} />

          {/* Patient Routes */}
          <Route
            path="/dashboard"
            element={
              <RoleBasedRoute requiredRole="patient">
                <DashboardPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/dentists"
            element={
              <RoleBasedRoute requiredRole="patient">
                <DentistsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <RoleBasedRoute requiredRole="patient">
                <AppointmentsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/appointments/new"
            element={
              <RoleBasedRoute requiredRole="patient">
                <BookAppointmentPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/appointments/:id"
            element={
              <RoleBasedRoute requiredRole="patient">
                <AppointmentDetailsPage />
              </RoleBasedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <RoleBasedRoute requiredRole="staff">
                <StaffDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/staff/admin"
            element={
              <RoleBasedRoute requiredRole="staff">
                <StaffAdminDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/staff/appointments"
            element={
              <RoleBasedRoute requiredRole="staff">
                <StaffAppointments />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/staff/dentists"
            element={
              <RoleBasedRoute requiredRole="staff">
                <StaffDentists />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/staff/services"
            element={
              <RoleBasedRoute requiredRole="staff">
                <StaffServices />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/staff/patients"
            element={
              <RoleBasedRoute requiredRole="staff">
                <StaffPatients />
              </RoleBasedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
