import { useState, useEffect } from "react";
import axios from "axios";

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    axios
      .get("http://127.0.0.1:8000/api/appointments/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments");
        setLoading(false);
      });
  };

  const handleCancel = (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/appointments/${appointmentId}/cancel/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => {
        setAppointments(
          appointments.map((apt) =>
            apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt,
          ),
        );
      })
      .catch((error) => {
        console.error("Error cancelling appointment:", error);
        setError("Failed to cancel appointment");
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "pending":
        return "⏳";
      case "completed":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "❓";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg animate-pulse">
          ⏳ Loading your appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          📋 Your Appointments
        </h2>
      </div>

      <div className="p-8 max-h-[600px] overflow-y-auto">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
            ⚠️ {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              📭 No appointments booked yet.
            </p>
            <p className="text-gray-400 mt-2">
              Book your first appointment to see it here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 hover:shadow-md transition-all hover:translate-x-1"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      🦷 Dr. {appointment.dentist_detail.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.dentist_detail.specialization}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 whitespace-nowrap ml-2 ${getStatusColor(appointment.status)}`}
                  >
                    {getStatusIcon(appointment.status)}{" "}
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 bg-white p-3 rounded">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      📆 Date
                    </p>
                    <p className="font-bold text-gray-800 text-sm">
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      🕐 Time
                    </p>
                    <p className="font-bold text-gray-800 text-sm">
                      {appointment.time}
                    </p>
                  </div>
                </div>

                {appointment.service_detail && (
                  <div className="mb-3 p-3 bg-purple-50 rounded border border-purple-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">💊 Service:</span>{" "}
                      {appointment.service_detail.name}
                    </p>
                    <p className="text-sm text-green-600 font-bold">
                      💰 ${appointment.service_detail.price}
                    </p>
                  </div>
                )}

                {appointment.status !== "cancelled" &&
                  appointment.status !== "completed" && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold p-2 rounded-lg transition duration-200 text-sm"
                    >
                      ❌ Cancel Appointment
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentList;
