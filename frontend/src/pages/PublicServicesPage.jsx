import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function PublicServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api
      .get("services/")
      .then((response) => setServices(response.data))
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-teal-700 font-semibold">
          ← DentalCare home
        </Link>
        <div className="mt-10 max-w-2xl">
          <p className="text-teal-700 font-bold uppercase tracking-[0.2em] text-sm">
            Our care
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3">
            Services designed around your smile.
          </h1>
          <p className="text-slate-600 text-lg mt-4">
            Explore our available treatments and choose the right care for your
            next visit.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service) => (
            <article
              key={service.id}
              className="bg-white border border-slate-200 p-6 rounded-2xl"
            >
              <p className="text-teal-700 font-bold">
                {service.duration_minutes} min
              </p>
              <h2 className="text-xl font-bold mt-3">{service.name}</h2>
              <p className="text-slate-600 mt-3 min-h-12">
                {service.description ||
                  "Personalized care from our dental team."}
              </p>
              <p className="text-2xl font-bold mt-6">
                ${Number(service.price).toFixed(2)}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <Link
            to="/signup"
            className="inline-block px-6 py-3 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700"
          >
            Book a visit
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PublicServicesPage;
