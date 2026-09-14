import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login, getCurrentUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // 1. Login and get token
      await login(email, password);

      // 2. Fetch user data
      const userData = await getCurrentUser();

      // 3. Update AuthContext with user data
      updateUser(userData);

      // 4. Determine redirect based on role
      const redirectUrl = userData.is_staff ? "/staff/dashboard" : "/dashboard";
      navigate(redirectUrl, {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 px-6 py-10 text-slate-900 sm:py-16">
      {/* Left */}

      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-300">Welcome back</p>
          <h1 className="mt-8 text-5xl font-bold leading-tight">A healthier smile is one visit away.</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-300">Sign in to manage your appointments, meet your care team, and keep your next visit on track.</p>
        </div>

        <p className="border-t border-slate-700 pt-6 text-sm text-slate-400">Personal care. Clear choices. Better visits.</p>
        </section>

      {/* Right */}

      <section className="flex items-center justify-center p-7 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">Patient portal</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Sign in to DentalCare</h2>
            <p className="mt-2 text-slate-500">Manage your appointments from one calm, simple place.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 py-3.5 font-bold text-white transition hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            Don't have an account?
            <Link to="/signup" className="ml-1 font-bold text-teal-700 hover:text-teal-800">
              Create account
            </Link>
          </p>
        </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
