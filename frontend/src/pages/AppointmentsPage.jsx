import { useEffect, useState } from "react";
import {
  getAppointments,
  cancelAppointment,
} from "../services/appointmentService";

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    try {
      await cancelAppointment(id);

      await loadAppointments();
    } catch (error) {
      console.error(error);
      alert("Could not cancel appointment.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading appointments...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              My Appointments
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your upcoming dental appointments.
            </p>
          </div>

          <a
            href="/appointments/new"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            + Book Appointment
          </a>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <h2 className="text-xl font-semibold">No appointments yet</h2>

            <p className="text-gray-500 mt-2">
              Book your first dental appointment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold text-lg">
                    {appointment.dentist_name || appointment.dentist?.name}
                  </h2>

                  <p className="text-gray-500">
                    {appointment.service_name || appointment.service?.name}
                  </p>

                  <p className="mt-2">📅 {appointment.date}</p>

                  <p>🕐 {appointment.time}</p>
                </div>

                <button
                  onClick={() => handleCancel(appointment.id)}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AppointmentsPage;
