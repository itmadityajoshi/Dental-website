import { useEffect, useState } from "react";
import api from "../../services/api";
import { doctorName } from "../../utils/display";

export default function StaffAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("appointments/");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.patch(`appointments/${appointmentId}/`, {
        status,
      });
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        await api.delete(`appointments/${appointmentId}/`);
        fetchAppointments();
        setSelectedAppointment(null);
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const filteredAppointments =
    filterStatus === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Manage Appointments
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all patient appointments
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 flex gap-2 p-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filterStatus === status
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "All Appointments" : status}
              </button>
            ),
          )}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex gap-4 items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patient_name || "Patient"}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      📅 {appointment.date || appointment.appointment_date} at{" "}
                      {appointment.time ||
                        appointment.appointment_time ||
                        appointment.time_slot}
                    </p>
                    <p className="text-gray-600 text-sm">
                      🦷 {doctorName(appointment.dentist_name, "Unassigned")} •{" "}
                      {appointment.service_name || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(appointment);
                      }}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No appointments found</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Appointment Details
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Patient Name</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedAppointment.patient_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date & Time</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedAppointment.date ||
                      selectedAppointment.appointment_date}{" "}
                    at{" "}
                    {selectedAppointment.time ||
                      selectedAppointment.appointment_time ||
                      selectedAppointment.time_slot}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Dentist</p>
                  <p className="text-gray-900 font-semibold">
                    {doctorName(selectedAppointment.dentist_name, "Unassigned")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Service</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedAppointment.service_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Current Status</p>
                  <p className="text-gray-900 font-semibold capitalize">
                    {selectedAppointment.status}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedAppointment.status !== "confirmed" && (
                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        selectedAppointment.id,
                        "confirmed",
                      )
                    }
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Mark as Confirmed
                  </button>
                )}
                {selectedAppointment.status !== "completed" && (
                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        selectedAppointment.id,
                        "completed",
                      )
                    }
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    Mark as Completed
                  </button>
                )}
                {selectedAppointment.status !== "cancelled" && (
                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        selectedAppointment.id,
                        "cancelled",
                      )
                    }
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel Appointment
                  </button>
                )}
                <button
                  onClick={() => deleteAppointment(selectedAppointment.id)}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full mt-4 px-4 py-2 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
