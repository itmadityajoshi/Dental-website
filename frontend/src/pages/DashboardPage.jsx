import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DentistCard from "../components/DentistCard";

import { getCurrentUser } from "../services/authService";
import { getDentists } from "../services/dentistService";
import { getAppointments } from "../services/appointmentService";
import { doctorName } from "../utils/display";

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userData, dentistData, appointmentData] = await Promise.all([
          getCurrentUser(),
          getDentists(),
          getAppointments(),
        ]);

        setUser(userData);
        setDentists(dentistData);
        setAppointments(appointmentData);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const upcomingAppointment = appointments
    .filter(
      (appointment) =>
        appointment.date >= today &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed",
    )
    .sort((first, second) =>
      `${first.date}T${first.time}`.localeCompare(
        `${second.date}T${second.time}`,
      ),
    )[0];

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome */}

        <section className="mb-10">
          <p className="text-teal-700 font-medium">Patient Dashboard</p>

          <h1 className="text-4xl font-bold text-slate-900 mt-1">
            Welcome back, {user?.first_name || user?.email}
          </h1>

          <p className="text-slate-600 mt-2">
            Manage your dental appointments and find the right care for you.
          </p>
        </section>

        {/* Quick Actions */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Book */}

          <button
            onClick={() => navigate("/appointments/new")}
            className="bg-teal-600 text-white rounded-xl p-6 text-left hover:bg-teal-700 transition"
          >
            <div className="text-3xl mb-4">📅</div>

            <h2 className="text-xl font-bold">Book Appointment</h2>

            <p className="text-blue-100 mt-1">
              Schedule your next dental visit.
            </p>
          </button>

          {/* Appointments */}

          <button
            onClick={() => navigate("/appointments")}
            className="bg-white border border-slate-200 rounded-xl p-6 text-left hover:shadow-md transition"
          >
            <div className="text-3xl mb-4">🗓️</div>

            <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>

            <p className="text-gray-500 mt-1">
              View and manage your appointments.
            </p>
          </button>

          {/* Dentists */}

          <button
            onClick={() => navigate("/dentists")}
            className="bg-white border border-slate-200 rounded-xl p-6 text-left hover:shadow-md transition"
          >
            <div className="text-3xl mb-4">👨‍⚕️</div>

            <h2 className="text-xl font-bold text-gray-800">Find a Dentist</h2>

            <p className="text-gray-500 mt-1">
              Browse our dental professionals.
            </p>
          </button>
        </section>

        {/* Stats */}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-500 text-sm">My Appointments</p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {appointments.length}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-500 text-sm">Available Dentists</p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {dentists.length}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-500 text-sm">Patient Status</p>

            <p className="text-lg font-semibold text-green-600 mt-3">Active</p>
          </div>
        </section>

        {/* Upcoming Appointment */}

        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Upcoming Appointment
            </h2>

            <button
              onClick={() => navigate("/appointments")}
              className="text-teal-700 hover:text-teal-800 font-medium"
            >
              View all
            </button>
          </div>

          {upcomingAppointment ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="text-sm text-teal-700 font-medium">
                    NEXT VISIT
                  </p>

                  <h3 className="text-xl font-bold text-gray-800 mt-1">
                    {doctorName(
                      upcomingAppointment.dentist_name ||
                        upcomingAppointment.dentist?.name,
                    )}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {upcomingAppointment.service_name ||
                      upcomingAppointment.service?.name ||
                      "Dental appointment"}
                  </p>
                </div>

                <div className="flex gap-8">
                  <div>
                    <p className="text-sm text-gray-400">Date</p>

                    <p className="font-semibold text-gray-800">
                      {upcomingAppointment.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Time</p>

                    <p className="font-semibold text-gray-800">
                      {upcomingAppointment.time}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/appointments/${upcomingAppointment.id}`)
                  }
                  className="px-5 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  View Details
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">📅</div>

              <h3 className="font-semibold text-lg text-gray-800">
                No upcoming appointments
              </h3>

              <p className="text-gray-500 mt-1 mb-5">
                You don't have any scheduled visits.
              </p>

              <button
                onClick={() => navigate("/appointments/new")}
                className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700"
              >
                Book an Appointment
              </button>
            </div>
          )}
        </section>

        {/* Dentists */}

        <section>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Our Dentists</h2>

              <p className="text-gray-500 mt-1">
                Meet our dental professionals.
              </p>
            </div>

            <button
              onClick={() => navigate("/dentists")}
              className="text-teal-700 font-medium"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dentists.slice(0, 3).map((dentist) => (
              <DentistCard key={dentist.id} dentist={dentist} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
