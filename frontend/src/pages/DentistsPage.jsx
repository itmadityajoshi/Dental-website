import { useEffect, useState } from "react";
import DentistCard from "../components/DentistCard";
import { getDentists } from "../services/dentistService";

function DentistsPage() {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDentists()
      .then((data) => {
        setDentists(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading dentists...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Our Dentists</h1>

          <p className="text-gray-500 mt-2">
            Meet our experienced dental professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {dentists.map((dentist) => (
            <DentistCard key={dentist.id} dentist={dentist} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default DentistsPage;
