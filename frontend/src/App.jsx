import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DentistsPage from "./pages/DentistsPage";
import SignupPage from "./pages/SignupPage";
import AppointmentPage from "./pages/AppointmentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dentists" element={<DentistsPage />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
