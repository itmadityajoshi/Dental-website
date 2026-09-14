import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login, getCurrentUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Register new user
      await register({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      });

      // 2. Auto-login with the credentials
      await login(email, password);

      // 3. Fetch user data
      const userData = await getCurrentUser();

      // 4. Update AuthContext with user data
      updateUser(userData);

      // 5. Redirect to dashboard
      const redirectUrl = userData.is_staff ? "/staff/dashboard" : "/dashboard";
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstErrorField = Object.keys(data)[0];
        setError(
          typeof data[firstErrorField] === "string"
            ? data[firstErrorField]
            : data[firstErrorField][0],
        );
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 px-6 py-10 text-slate-900 sm:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-teal-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full border-32 border-white/10" />
          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-100">
              Join DentalCare
            </p>
            <h1 className="mt-8 text-5xl font-bold leading-tight">
              Make room for a healthier smile.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-teal-50">
              Create your account to discover trusted dentists, choose your
              service, and book care around your schedule.
            </p>
          </div>
          <p className="relative border-t border-teal-500 pt-6 text-sm text-teal-100">
            Your care journey starts with a simple step.
          </p>
        </section>

        <section className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
                New patient
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Create your account
              </h2>
              <p className="mt-2 text-slate-500">
                Set up your patient profile in less than a minute.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-teal-600 py-3.5 font-bold text-white transition hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500">
              Already have an account?
              <Link
                to="/login"
                className="ml-1 font-bold text-teal-700 hover:text-teal-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SignupPage;
