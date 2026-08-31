import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DentistCard from "../components/DentistCard";
import Navbar from "../components/Navbar";

function DentistsPage() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/dentists/")
      .then((response) => {
        setDentists(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching dentists:", error));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading dentists...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Meet Our Dentists
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Experienced professionals dedicated to your dental health
            </p>
            <button
              onClick={() => navigate("/appointments")}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
            >
              📅 Book an Appointment
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
              <h3 className="text-gray-600 text-sm font-semibold uppercase">
                Total Dentists
              </h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {dentists.length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
              <h3 className="text-gray-600 text-sm font-semibold uppercase">
                Specializations
              </h3>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {new Set(dentists.map((d) => d.specialization)).size}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500">
              <h3 className="text-gray-600 text-sm font-semibold uppercase">
                Hours
              </h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                9 AM - 5 PM
              </p>
            </div>
          </div>

          {/* Dentists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dentists.map((dentist) => (
              <DentistCard key={dentist.id} dentist={dentist} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DentistsPage;
