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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left */}

      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-16 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              🦷
            </div>

            <span className="text-2xl font-bold">DentalCare</span>
          </div>

          <div className="mt-24 max-w-lg">
            <p className="text-blue-100 font-medium mb-4">
              YOUR SMILE. OUR PRIORITY.
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Modern dental care made simple.
            </h1>

            <p className="text-blue-100 text-lg mt-6 leading-relaxed">
              Find trusted dentists, book appointments, and manage your dental
              care from one place.
            </p>
          </div>
        </div>

        <p className="text-blue-200 text-sm">
          Professional dental care for every smile.
        </p>
      </div>

      {/* Right */}

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>

            <p className="text-gray-500 mt-2">
              Sign in to manage your appointments.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Don't have an account?
            <Link to="/signup" className="text-blue-600 font-semibold ml-1">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
