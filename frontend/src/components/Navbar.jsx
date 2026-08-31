import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info from backend
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/accounts/user/", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          console.log("User data received:", response.data);
          setFirstName(response.data.first_name || "");
          setLastName(response.data.last_name || "");
          setEmail(response.data.email || "");
        })
        .catch((error) => {
          console.error(
            "Error fetching user:",
            error.response?.data || error.message,
          );
        });
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  const fullName =
    firstName && lastName ? `${firstName} ${lastName}` : email || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = "";
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold">🦷 Dental Clinic</h1>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => navigate("/dentists")}
                className="hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-200 font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/appointments")}
                className="hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-200 font-medium"
              >
                My Appointments
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-blue-100">Welcome</p>
              <p className="font-semibold text-lg">{fullName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
