import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { logout as logoutService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, userRole, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logoutService();
    logout();
    navigate("/login", { replace: true });
  };

  const isStaff = userRole === "staff";

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink
            to={isStaff ? "/staff/dashboard" : "/dashboard"}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white text-lg font-bold">
              🦷
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              DentalCare
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isStaff ? (
              // Staff Navigation
              <>
                <NavLink to="/staff/dashboard" className={navLinkClass}>
                  📊 Dashboard
                </NavLink>
                <NavLink to="/staff/admin" className={navLinkClass}>
                  ⚙️ Admin
                </NavLink>
                <NavLink to="/staff/appointments" className={navLinkClass}>
                  📅 Appointments
                </NavLink>
                <NavLink to="/staff/dentists" className={navLinkClass}>
                  👨‍⚕️ Dentists
                </NavLink>
                <NavLink to="/staff/services" className={navLinkClass}>
                  💊 Services
                </NavLink>
                <NavLink to="/staff/patients" className={navLinkClass}>
                  👥 Patients
                </NavLink>
              </>
            ) : (
              // Patient Navigation
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/dentists" className={navLinkClass}>
                  Dentists
                </NavLink>
                <NavLink to="/appointments" className={navLinkClass}>
                  My Appointments
                </NavLink>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user.first_name || user.email}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {isStaff ? "🧑‍⚕️ Staff" : "👤 Patient"}
              </p>
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition"
              >
                {user.first_name
                  ? user.first_name.charAt(0).toUpperCase()
                  : "U"}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            {isStaff ? (
              <>
                <NavLink
                  to="/staff/dashboard"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/staff/appointments"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Appointments
                </NavLink>
                <NavLink
                  to="/staff/dentists"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dentists
                </NavLink>
                <NavLink
                  to="/staff/services"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </NavLink>
                <NavLink
                  to="/staff/patients"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Patients
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/dentists"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dentists
                </NavLink>
                <NavLink
                  to="/appointments"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Appointments
                </NavLink>
              </>
            )}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
