import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAppointments } from "../services/appointmentService";
import { doctorName } from "../utils/display";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

function AppointmentDetailsPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointments()
      .then((appointments) => {
        setAppointment(
          appointments.find((item) => String(item.id) === String(id)) || null,
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading appointment...</p>
    );
  }

  if (!appointment) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Appointment not found
        </h1>
        <Link
          to="/appointments"
          className="inline-block mt-4 text-blue-600 font-semibold"
        >
          Back to appointments
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/appointments" className="text-blue-600 font-semibold">
          ← My Appointments
        </Link>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mt-6">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-blue-600 font-semibold uppercase">
                Appointment details
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {appointment.service_name ||
                  appointment.service?.name ||
                  "Dental appointment"}
              </h1>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusStyles[appointment.status] || "bg-gray-100 text-gray-800"}`}
            >
              {appointment.status}
            </span>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm text-gray-500">Dentist</dt>
              <dd className="mt-1 font-semibold text-gray-900">
                {doctorName(
                  appointment.dentist_name || appointment.dentist?.name,
                  "Unassigned",
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Date</dt>
              <dd className="mt-1 font-semibold text-gray-900">
                {appointment.date}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Time</dt>
              <dd className="mt-1 font-semibold text-gray-900">
                {appointment.time}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Service duration</dt>
              <dd className="mt-1 font-semibold text-gray-900">
                {appointment.service_detail?.duration_minutes ||
                  appointment.service?.duration_minutes ||
                  "30"}{" "}
                minutes
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}

export default AppointmentDetailsPage;
