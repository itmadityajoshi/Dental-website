import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StaffPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // Fetch all appointments to get patient info
      const appointmentsRes = await api.get("appointments/");

      // Extract unique patients from appointments
      const uniquePatients = {};
      appointmentsRes.data.forEach((apt) => {
        if (apt.patient_email && !uniquePatients[apt.patient_email]) {
          uniquePatients[apt.patient_email] = {
            id: apt.patient_id || `patient-${apt.patient_email}`,
            email: apt.patient_email,
            name: apt.patient_name || "Unknown",
            appointments: 1,
          };
        } else if (apt.patient_email) {
          uniquePatients[apt.patient_email].appointments += 1;
        }
      });

      setPatients(Object.values(uniquePatients));
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-2">
            View all patient information and appointment history
          </p>
        </div>

        {/* Patients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Patient: {patient.name}
                    </h3>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-teal-700">
                    {patient.appointments}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatient(patient);
                  }}
                  className="w-full mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-semibold"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No patients found</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedPatient.name}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedPatient.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Appointments</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedPatient.appointments}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="w-full px-4 py-2 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition"
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
