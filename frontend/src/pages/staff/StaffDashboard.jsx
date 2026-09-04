import { useEffect, useState } from "react";
import api from "../../services/api";
import { doctorName } from "../../utils/display";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    total_appointments: 0,
    total_dentists: 0,
    total_services: 0,
    total_patients: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all appointments
        const appointmentsRes = await api.get("appointments/");

        // Fetch dentists
        const dentistsRes = await api.get("dentists/");

        // Fetch services
        const servicesRes = await api.get("services/");

        // Fetch all patients (assuming this endpoint exists)
        const patientsRes = await api
          .get("accounts/patients/")
          .catch(() => ({ data: [] }));

        setStats({
          total_appointments: appointmentsRes.data.length,
          total_dentists: dentistsRes.data.length,
          total_services: servicesRes.data.length,
          total_patients: patientsRes.data.length,
        });

        // Filter today's appointments
        const today = new Date().toISOString().split("T")[0];
        const today_appointments = appointmentsRes.data.filter(
          (apt) => (apt.date || apt.appointment_date) === today,
        );
        setTodayAppointments(today_appointments);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening at your clinic today.
          </p>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-linear-to-r from-slate-950 to-slate-800 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              Today's Appointments
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Dentist
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {apt.time || apt.appointment_time || apt.time_slot}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {apt.patient_name || "Patient"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {doctorName(apt.dentist_name, "N/A")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {apt.service_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            apt.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {apt.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No appointments scheduled for today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total_appointments}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl">
                📅
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Dentists
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total_dentists}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                🦷
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Services
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total_services}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                ⚕️
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Patients
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total_patients}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/staff/appointments"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">📋</div>
              <p className="font-semibold text-gray-900">Manage Appointments</p>
            </a>
            <a
              href="/staff/dentists"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">🦷</div>
              <p className="font-semibold text-gray-900">Manage Dentists</p>
            </a>
            <a
              href="/staff/services"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">⚕️</div>
              <p className="font-semibold text-gray-900">Manage Services</p>
            </a>
            <a
              href="/staff/patients"
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">👥</div>
              <p className="font-semibold text-gray-900">View Patients</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
