import { useState, useEffect } from "react";
import axios from "axios";

function AppointmentBooking() {
  const [dentists, setDentists] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch dentists and services
    axios
      .get("http://127.0.0.1:8000/api/dentists/")
      .then((response) => setDentists(response.data))
      .catch((error) => console.error("Error fetching dentists:", error));

    axios
      .get("http://127.0.0.1:8000/api/services/")
      .then((response) => setServices(response.data))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!selectedDentist || !appointmentDate || !appointmentTime) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/api/appointments/create/",
        {
          dentist: selectedDentist,
          service: selectedService || null,
          date: appointmentDate,
          time: appointmentTime,
        },
        {
          headers: { Authorization: `Token ${token}` },
        },
      )
      .then(() => {
        setSuccess("Appointment booked successfully!");
        setSelectedDentist("");
        setSelectedService("");
        setAppointmentDate("");
        setAppointmentTime("");
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Failed to book appointment";
        setError(errorMsg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          📅 Book an Appointment
        </h2>
      </div>

      <div className="p-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 animate-pulse">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 animate-pulse">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dentist Selection */}
          <div>
            <label className="block text-gray-800 font-bold mb-3 text-lg">
              🦷 Select Dentist <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              required
            >
              <option value="">Choose a dentist</option>
              {dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  Dr. {dentist.name} - {dentist.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-gray-800 font-bold mb-3 text-lg">
              💊 Select Service
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            >
              <option value="">Choose a service (optional)</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-gray-800 font-bold mb-3 text-lg">
              📆 Appointment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-gray-800 font-bold mb-3 text-lg">
              🕐 Appointment Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold p-3 rounded-lg hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-105 text-lg shadow-lg"
          >
            {loading ? "🔄 Booking..." : "✅ Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AppointmentBooking;
