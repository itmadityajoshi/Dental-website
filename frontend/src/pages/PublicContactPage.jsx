import { Link } from "react-router-dom";

function PublicContactPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-teal-700 font-semibold">
          ← DentalCare home
        </Link>
        <div className="grid lg:grid-cols-2 gap-12 items-start mt-12">
          <div>
            <p className="text-teal-700 font-bold uppercase tracking-[0.2em] text-sm">
              Visit or call us
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3">
              Let’s make your next visit easy.
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mt-5">
              Our friendly team is ready to answer questions, help you choose a
              service, and find a convenient appointment.
            </p>
          </div>
          <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-7">
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
    </main>
  );
}

export default PublicContactPage;
