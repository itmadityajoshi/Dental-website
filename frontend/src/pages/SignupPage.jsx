import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login, getCurrentUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-600 text-white p-16 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              🦷
            </div>
            <span className="text-2xl font-bold">DentalCare</span>
          </div>

          <div className="mt-24 max-w-lg">
            <p className="text-green-100 font-medium mb-4">JOIN US TODAY</p>
            <h1 className="text-5xl font-bold leading-tight">
              Start your dental journey with us.
            </h1>
            <p className="text-green-100 text-lg mt-6 leading-relaxed">
              Create an account to book appointments, track your dental health,
              and connect with trusted professionals.
            </p>
          </div>
        </div>

        <p className="text-green-200 text-sm">
          Your smile deserves the best care.
        </p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="text-gray-500 mt-2">Join us to get started.</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Already have an account?
            <Link to="/login" className="text-green-600 font-semibold ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
