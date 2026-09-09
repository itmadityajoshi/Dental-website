import { useEffect, useState } from "react";
import api from "../../services/api";
import { doctorName, mediaUrl } from "../../utils/display";

export default function StaffDentists() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    bio: "",
    working_start: "09:00",
    working_end: "17:00",
    photo: null,
  });

  useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    try {
      const response = await api.get("dentists/");
      setDentists(response.data);
    } catch (error) {
      console.error("Error fetching dentists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      photo: e.target.files[0] || null,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialization: "",
      bio: "",
      working_start: "09:00",
      working_end: "17:00",
      photo: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") payload.append(key, value);
      });

      if (editingId) {
        await api.put(`dentists/${editingId}/`, payload);
      } else {
        await api.post("dentists/", payload);
      }
      fetchDentists();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("Error saving dentist:", error);
    }
  };

  const handleEdit = (dentist) => {
    setFormData({
      name: dentist.name || "",
      specialization: dentist.specialization || "",
      bio: dentist.bio || "",
      working_start: dentist.working_start || "09:00",
      working_end: dentist.working_end || "17:00",
      photo: null,
    });
    setEditingId(dentist.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this dentist?")) {
      try {
        await api.delete(`dentists/${id}/`);
        fetchDentists();
      } catch (error) {
        console.error("Error deleting dentist:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dentists...</p>
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
              Manage Dentists
            </h1>
            <p className="text-gray-600 mt-2">
              Add, edit, and manage your dentist team
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              resetForm();
            }}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
          >
            {showForm ? "Cancel" : "+ Add Dentist"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Dentist" : "Add New Dentist"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dentist Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g., Orthodontist, Periodontist"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biography
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Start Time
                  </label>
                  <input
                    type="time"
                    name="working_start"
                    value={formData.working_start}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working End Time
                  </label>
                  <input
                    type="time"
                    name="working_end"
                    value={formData.working_end}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
              >
                {editingId ? "Update Dentist" : "Add Dentist"}
              </button>
            </form>
          </div>
        )}

        {/* Dentists List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dentists.map((dentist) => (
            <div
              key={dentist.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              {dentist.photo ? (
                <img
                  src={mediaUrl(dentist.photo)}
                  alt={doctorName(dentist.name)}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              ) : null}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {doctorName(
                  dentist.name ||
                    `${dentist.first_name || ""} ${dentist.last_name || ""}`.trim(),
                )}
              </h3>
              {dentist.specialization && (
                <p className="text-sm text-teal-700 mb-3">
                  {dentist.specialization}
                </p>
              )}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <p>
                  ⏰ {dentist.working_start} - {dentist.working_end}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dentist)}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dentist.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {dentists.length === 0 && !showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No dentists added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
            >
              Add First Dentist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
