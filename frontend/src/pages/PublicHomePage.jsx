import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const timer = setInterval(
      () => setSlide((current) => (current + 1) % slides.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[slide];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.22),_transparent_42%),linear-gradient(135deg,_#0f172a,_#164e63)]" />
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
            <div className="relative min-h-72 h-[28rem] rounded-3xl overflow-hidden border border-teal-200/20 bg-teal-300/10">
              <img
                src={currentSlide.image}
                alt="DentalCare clinic"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
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
              <div className="absolute top-1/2 inset-x-4 flex justify-between -translate-y-1/2">
                <button
                  onClick={() =>
                    setSlide((slide - 1 + slides.length) % slides.length)
                  }
                  aria-label="Previous slide"
                  className="w-10 h-10 rounded-full bg-slate-950/60 text-white text-xl hover:bg-slate-950/90"
                >
                  ←
                </button>
                <button
                  onClick={() => setSlide((slide + 1) % slides.length)}
                  aria-label="Next slide"
                  className="w-10 h-10 rounded-full bg-slate-950/60 text-white text-xl hover:bg-slate-950/90"
                >
                  →
                </button>
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
      <section className="bg-slate-100 px-6 py-8 text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-4 text-sm font-semibold">
          <span>125 Main Street, Downtown</span>
          <a href="tel:+15550123456">+1 (555) 012-3456</a>
          <Link to="/services" className="text-teal-700">
            View services
          </Link>
          <Link to="/contact" className="text-teal-700">
            Contact the clinic
          </Link>
        </div>
      </section>
    </main>
  );
}

export default PublicHomePage;
