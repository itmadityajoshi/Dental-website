import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout as logoutService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const patientLinks = [
  ["Dashboard", "/dashboard", "⌂"],
  ["Dentists", "/dentists", "♙"],
  ["My Appointments", "/appointments", "▣"],
];

const staffLinks = [
  ["Dashboard", "/staff/dashboard", "⌂"],
  ["Admin", "/staff/admin", "⚙"],
  ["Appointments", "/staff/appointments", "▣"],
  ["Dentists", "/staff/dentists", "♙"],
  ["Services", "/staff/services", "✚"],
  ["Patients", "/staff/patients", "♙"],
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, userRole, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const isStaff = userRole === "staff";
  const links = isStaff ? staffLinks : patientLinks;

  const handleLogout = () => {
    logoutService();
    logout();
    navigate("/login", { replace: true });
  };

  const navigation = (
    <div className="space-y-2">
      {links.map(([label, to, icon]) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              isActive
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <span className="w-6 text-center text-lg" aria-hidden="true">
            {icon}
          </span>
          {label}
        </NavLink>
      ))}
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 flex-col bg-slate-950 px-5 py-6 text-white">
        <NavLink
          to={isStaff ? "/staff/dashboard" : "/dashboard"}
          className="flex items-center gap-3 px-3 mb-10"
        >
          <span className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-xl">
            ✦
          </span>
          <span className="text-xl font-bold">DentalCare</span>
        </NavLink>
        <p className="px-4 mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          {isStaff ? "Clinic workspace" : "Patient space"}
        </p>
        {navigation}
        <div className="mt-auto border-t border-slate-800 pt-5">
          <p className="px-3 text-sm font-semibold truncate">
            {user.first_name || user.email}
          </p>
          <p className="px-3 mt-1 text-xs text-slate-400">
            {isStaff ? "Staff" : "Patient"}
          </p>
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 text-left text-sm font-semibold text-red-300 rounded-lg hover:bg-red-950/50"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="md:hidden sticky top-0 z-50 flex h-16 items-center justify-between bg-slate-950 px-4 text-white">
        <NavLink
          to={isStaff ? "/staff/dashboard" : "/dashboard"}
          className="text-lg font-bold"
        >
          DentalCare
        </NavLink>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          className="rounded-lg px-3 py-2 text-xl hover:bg-slate-800"
        >
          ☰
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-slate-950 px-5 py-5 shadow-xl">
          {navigation}
          <button
            onClick={handleLogout}
            className="w-full mt-5 border-t border-slate-800 pt-4 text-left text-sm font-semibold text-red-300"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
