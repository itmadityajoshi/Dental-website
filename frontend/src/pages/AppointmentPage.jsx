import { useState } from "react";
import Navbar from "../components/Navbar";
import AppointmentBooking from "../components/AppointmentBooking";
import AppointmentList from "../components/AppointmentList";

function AppointmentPage() {
  const [refresh, setRefresh] = useState(0);

  const handleAppointmentBooked = () => {
    setRefresh(refresh + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-10">
            Manage Your Appointments
          </h1>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Booking Form */}
            <div>
              <AppointmentBooking
                onAppointmentBooked={handleAppointmentBooked}
              />
            </div>

            {/* Right Column - Appointments List */}
            <div>
              <AppointmentList key={refresh} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentPage;
