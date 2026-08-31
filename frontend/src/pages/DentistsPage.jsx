import { useState, useEffect } from "react";
import axios from "axios";
import DentistCard from "../components/DentistCard";

function DentistsPage() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Our Dentists
      </h1>
      <div className="max-w-2xl mx-auto grid gap-4">
        {dentists.map((dentist) => (
          <DentistCard key={dentist.id} dentist={dentist} />
        ))}
      </div>
    </div>
  );
}

export default DentistsPage;
