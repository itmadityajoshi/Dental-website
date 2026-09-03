import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { doctorName, mediaUrl } from "../../utils/display";

export default function StaffAdminDashboard() {
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Service form states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
  });

  // Dentist form states
  const [showDentistForm, setShowDentistForm] = useState(false);
  const [editingDentist, setEditingDentist] = useState(null);
  const [dentistFormData, setDentistFormData] = useState({
    name: "",
    specialization: "",
    bio: "",
    working_start: "09:00",
    working_end: "17:00",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [servicesRes, dentistsRes, appointmentsRes] = await Promise.all([
        api.get("services/"),
        api.get("dentists/"),
        api.get("appointments/"),
      ]);
      setServices(servicesRes.data);
      setDentists(dentistsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      setError("Failed to load data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============ SERVICE HANDLERS ============
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`services/${editingService.id}/`, serviceFormData);
      } else {
        await api.post("services/", serviceFormData);
      }
      fetchAllData();
      setShowServiceForm(false);
      setEditingService(null);
      setServiceFormData({
        name: "",
        description: "",
        price: "",
        duration_minutes: "",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save service");
    }
  };

  const handleEditService = (service) => {
    setServiceFormData(service);
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Delete this service?")) {
      try {
        await api.delete(`services/${id}/`);
        fetchAllData();
      } catch (err) {
        setError("Failed to delete service");
      }
    }
  };

  // ============ DENTIST HANDLERS ============
  const handleDentistChange = (e) => {
    const { name, value } = e.target;
    setDentistFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDentistSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDentist) {
        await api.put(`dentists/${editingDentist.id}/`, dentistFormData);
      } else {
        await api.post("dentists/", dentistFormData);
      }
      fetchAllData();
      setShowDentistForm(false);
      setEditingDentist(null);
      setDentistFormData({
        name: "",
        specialization: "",
        bio: "",
        working_start: "09:00",
        working_end: "17:00",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save dentist");
    }
  };

  const handleEditDentist = (dentist) => {
    setDentistFormData(dentist);
    setEditingDentist(dentist);
    setShowDentistForm(true);
  };

  const handleDeleteDentist = async (id) => {
    if (window.confirm("Delete this dentist?")) {
      try {
        await api.delete(`dentists/${id}/`);
        fetchAllData();
      } catch (err) {
        setError("Failed to delete dentist");
      }
    }
  };

  const latestAppointment = [...appointments].sort((first, second) => {
    if (first.created_at && second.created_at) {
      return new Date(second.created_at) - new Date(first.created_at);
    }
    const firstDate = `${first.date || first.appointment_date}T${first.time || first.appointment_time || "00:00"}`;
    const secondDate = `${second.date || second.appointment_date}T${second.time || second.appointment_time || "00:00"}`;
    return new Date(secondDate) - new Date(firstDate);
  })[0];

  const sortedAppointments = [...appointments].sort((first, second) => {
    const firstDate = `${first.date || first.appointment_date}T${first.time || first.appointment_time || "00:00"}`;
    const secondDate = `${second.date || second.appointment_date}T${second.time || second.appointment_time || "00:00"}`;
    return new Date(secondDate) - new Date(firstDate);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage services, dentists, and appointments
          </p>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                activeTab === "services"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              💊 Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab("dentists")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                activeTab === "dentists"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              👨‍⚕️ Dentists ({dentists.length})
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                activeTab === "appointments"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📅 Appointments ({appointments.length})
            </button>
          </div>
        </div>

        {/* SERVICES TAB */}
        {activeTab === "services" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Services
              </h2>
              <button
                onClick={() => {
                  setShowServiceForm(!showServiceForm);
                  setEditingService(null);
                  setServiceFormData({
                    name: "",
                    description: "",
                    price: "",
                    duration_minutes: "",
                  });
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {showServiceForm ? "Cancel" : "+ Add Service"}
              </button>
            </div>

            {showServiceForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h3>
                <form onSubmit={handleServiceSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={serviceFormData.name}
                        onChange={handleServiceChange}
                        required
                        placeholder="e.g., Teeth Cleaning"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={serviceFormData.price}
                        onChange={handleServiceChange}
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        name="duration_minutes"
                        value={serviceFormData.duration_minutes}
                        onChange={handleServiceChange}
                        required
                        placeholder="30"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={serviceFormData.description}
                      onChange={handleServiceChange}
                      rows="4"
                      placeholder="Describe the service..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    {editingService ? "Update Service" : "Add Service"}
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {services.length > 0 ? (
                services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="text-gray-600 text-sm mt-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${parseFloat(service.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.duration_minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg mb-4">
                    No services added yet
                  </p>
                  <button
                    onClick={() => setShowServiceForm(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Add First Service
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DENTISTS TAB */}
        {activeTab === "dentists" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Dentists
              </h2>
              <button
                onClick={() => {
                  setShowDentistForm(!showDentistForm);
                  setEditingDentist(null);
                  setDentistFormData({
                    name: "",
                    specialization: "",
                    bio: "",
                    working_start: "09:00",
                    working_end: "17:00",
                  });
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {showDentistForm ? "Cancel" : "+ Add Dentist"}
              </button>
            </div>

            {showDentistForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {editingDentist ? "Edit Dentist" : "Add New Dentist"}
                </h3>
                <form onSubmit={handleDentistSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={dentistFormData.name}
                        onChange={handleDentistChange}
                        required
                        placeholder="Dr. John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={dentistFormData.specialization}
                        onChange={handleDentistChange}
                        placeholder="e.g., Orthodontist"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Start Time *
                      </label>
                      <input
                        type="time"
                        name="working_start"
                        value={dentistFormData.working_start}
                        onChange={handleDentistChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working End Time *
                      </label>
                      <input
                        type="time"
                        name="working_end"
                        value={dentistFormData.working_end}
                        onChange={handleDentistChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={dentistFormData.bio}
                      onChange={handleDentistChange}
                      rows="4"
                      placeholder="Professional biography..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    {editingDentist ? "Update Dentist" : "Add Dentist"}
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dentists.length > 0 ? (
                dentists.map((dentist) => (
                  <div
                    key={dentist.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                  >
                    <div className="mb-4">
                      {dentist.photo ? (
                        <img
                          src={mediaUrl(dentist.photo)}
                          alt={doctorName(dentist.name)}
                          className="w-16 h-16 rounded-full object-cover mb-3"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                          <span className="text-xl">👨‍⚕️</span>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {doctorName(dentist.name)}
                      </h3>
                      {dentist.specialization && (
                        <p className="text-sm text-green-600 font-medium">
                          {dentist.specialization}
                        </p>
                      )}
                      {dentist.bio && (
                        <p className="text-gray-600 text-sm mt-2">
                          {dentist.bio}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-3 rounded mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Hours:</span>{" "}
                        {dentist.working_start} - {dentist.working_end}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditDentist(dentist)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDentist(dentist.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg mb-4">
                    No dentists added yet
                  </p>
                  <button
                    onClick={() => setShowDentistForm(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Add First Dentist
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All Appointments
            </h2>

            {latestAppointment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6">
                <p className="text-sm font-semibold text-green-700 uppercase">
                  Latest appointment
                </p>
                <div className="flex flex-wrap justify-between gap-3 mt-2">
                  <p className="font-bold text-gray-900">
                    {latestAppointment.patient_name || "Patient"} with{" "}
                    {doctorName(latestAppointment.dentist_name)}
                  </p>
                  <p className="text-gray-700">
                    {latestAppointment.date ||
                      latestAppointment.appointment_date}{" "}
                    at{" "}
                    {latestAppointment.time ||
                      latestAppointment.appointment_time}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
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
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {apt.patient_name || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {doctorName(apt.dentist_name, "N/A")}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {apt.service_name || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {apt.date || apt.appointment_date} at{" "}
                            {apt.time || apt.appointment_time}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                apt.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : apt.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 text-lg">No appointments yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
