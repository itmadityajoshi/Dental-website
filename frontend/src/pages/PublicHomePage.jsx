import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const slides = [
  {
    eyebrow: "A healthier smile starts here",
    title: "Thoughtful dental care for every chapter of life.",
    text: "Connect with trusted dentists, discover the right treatment, and book a time that works for you.",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=85",
  },
  {
    eyebrow: "Comfortable care, clear choices",
    title: "A calmer way to look after your smile.",
    text: "See services, compare appointment times, and stay informed from booking to follow-up.",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85",
  },
  {
    eyebrow: "Your neighborhood dental team",
    title: "Expert attention with a personal touch.",
    text: "Meet a team that listens first and makes every visit feel straightforward.",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85",
  },
];

function PublicHomePage() {
  const [slide, setSlide] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const timer = setInterval(
      () => setSlide((current) => (current + 1) % slides.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api
      .get("services/")
      .then((response) => setServices(response.data))
      .catch(console.error);
  }, []);

  const currentSlide = slides[slide];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_42%),linear-gradient(135deg,#0f172a,#164e63)]" />
        <div className="relative max-w-7xl mx-auto">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-wide">
              DentalCare
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-teal-400 text-slate-950 text-sm font-bold hover:bg-teal-300"
              >
                Get started
              </Link>
            </div>
          </nav>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center py-24 lg:py-32">
            <div>
              <p className="text-teal-300 font-semibold uppercase tracking-[0.2em] text-sm">
                {currentSlide.eyebrow}
              </p>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight mt-5">
                {currentSlide.title}
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mt-6 max-w-xl">
                {currentSlide.text}
              </p>
              <div className="flex flex-wrap gap-4 mt-9">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100"
                >
                  Book your visit
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-lg border border-slate-500 text-white font-semibold hover:bg-white/10"
                >
                  Patient sign in
                </Link>
              </div>
            </div>
            <div className="relative min-h-72 h-112 rounded-3xl overflow-hidden border border-teal-200/20 bg-teal-300/10">
              <img
                src={currentSlide.image}
                alt="DentalCare clinic"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="relative h-full p-8 flex flex-col justify-end">
                <p className="text-6xl">✦</p>
                <h2 className="text-2xl font-bold mt-10">
                  Care that feels personal.
                </h2>
                <p className="text-slate-200 mt-2">
                  Clear appointments, experienced professionals, and a calmer
                  way to care for your smile.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pb-8" aria-label="Homepage slides">
            {slides.map((item, index) => (
              <button
                key={item.title}
                onClick={() => setSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${slide === index ? "w-10 bg-teal-300" : "w-2 bg-slate-500"}`}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white text-slate-900 px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <p className="text-teal-600 font-bold text-2xl">01</p>
            <h2 className="text-xl font-bold mt-3">Find your dentist</h2>
            <p className="text-slate-600 mt-2">
              Browse our dental professionals and their areas of care.
            </p>
          </div>
          <div>
            <p className="text-teal-600 font-bold text-2xl">02</p>
            <h2 className="text-xl font-bold mt-3">Choose your service</h2>
            <p className="text-slate-600 mt-2">
              Select the treatment you need before choosing a time.
            </p>
          </div>
          <div>
            <p className="text-teal-600 font-bold text-2xl">03</p>
            <h2 className="text-xl font-bold mt-3">Stay in control</h2>
            <p className="text-slate-600 mt-2">
              Track confirmations and manage your visits in one place.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-slate-100 px-6 py-20 text-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-teal-700 font-bold uppercase tracking-[0.2em] text-sm">
              Our care
            </p>
            <h2 className="text-4xl font-bold mt-3">
              Services designed around your smile.
            </h2>
            <p className="text-slate-600 text-lg mt-4">
              Explore available treatments before choosing your next visit.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {services.map((service) => (
              <article
                key={service.id}
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm"
              >
                <p className="text-teal-700 font-bold">
                  {service.duration_minutes} min
                </p>
                <h3 className="text-xl font-bold mt-3">{service.name}</h3>
                <p className="text-slate-600 mt-3 min-h-12">
                  {service.description ||
                    "Personalized care from our dental team."}
                </p>
              </article>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start mt-24 border-t border-slate-200 pt-16">
            <div>
              <p className="text-teal-700 font-bold uppercase tracking-[0.2em] text-sm">
                Visit or call us
              </p>
              <h2 className="text-4xl font-bold mt-3">
                Let’s make your next visit easy.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mt-5">
                Our friendly team is ready to answer questions and find a
                convenient appointment.
              </p>
            </div>
            <div className="bg-slate-950 text-white rounded-2xl p-8 space-y-7">
              <div>
                <p className="text-slate-400 text-sm">Clinic location</p>
                <p className="text-xl font-semibold mt-1">
                  125 Main Street, Downtown
                </p>
                <p className="text-slate-300 mt-1">Open Monday to Saturday</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Call us</p>
                <a
                  href="tel:+15550123456"
                  className="text-xl font-semibold mt-1 inline-block text-teal-300"
                >
                  +1 (555) 012-3456
                </a>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <a
                  href="mailto:hello@dentalcare.example"
                  className="text-lg font-semibold mt-1 inline-block"
                >
                  hello@dentalcare.example
                </a>
              </div>
              <Link
                to="/signup"
                className="inline-block px-5 py-3 rounded-lg bg-teal-400 text-slate-950 font-bold hover:bg-teal-300"
              >
                Request an appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PublicHomePage;
