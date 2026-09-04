import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeSlot from "../components/TimeSlot";

import { getDentists, getAvailableSlots } from "../services/dentistService";
import api from "../services/api";
import { createAppointment } from "../services/appointmentService";
import { doctorName } from "../utils/display";

function BookAppointmentPage() {
  const navigate = useNavigate();

  const [dentists, setDentists] = useState([]);
  const [services, setServices] = useState([]);

  const [dentist, setDentist] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    getDentists()
      .then((data) => {
        setDentists(data);
      })
      .catch(console.error);

    api
      .get("services/")
      .then((response) => setServices(response.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!dentist || !date) {
      setSlots([]);
      return;
    }

    setLoadingSlots(true);

    getAvailableSlots(dentist, date)
      .then((data) => {
        setSlots(data);
      })
      .catch((error) => {
        console.error(error);
        setSlots([]);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [dentist, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dentist || !service || !date || !selectedSlot) {
      alert("Please complete all fields.");
      return;
    }

    setBooking(true);

    try {
      await createAppointment({
        dentist: dentist,
        service: service,
        date: date,
        time: selectedSlot,
      });

      alert("Appointment booked successfully!");

      navigate("/appointments");
    } catch (error) {
      console.error(error);

      alert("Unable to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Book an Appointment
          </h1>

          <p className="text-gray-500 mt-2">
            Choose your dentist, service and preferred time.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-8"
        >
          {/* Dentist */}

          <div className="mb-6">
            <label className="block font-semibold mb-2">Dentist</label>

            <select
              value={dentist}
              onChange={(e) => {
                setDentist(e.target.value);
                setSelectedSlot("");
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">Select a dentist</option>

              {dentists.map((item) => (
                <option key={item.id} value={item.id}>
                  {doctorName(item.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Service */}

          <div className="mb-6">
            <label className="block font-semibold mb-2">Service</label>

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">Select a service</option>

              {services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}

          <div className="mb-8">
            <label className="block font-semibold mb-2">Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlot("");
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Slots */}

          {dentist && date && (
            <div className="mb-8">
              <h2 className="font-semibold mb-4">Available Times</h2>

              {loadingSlots ? (
                <p className="text-gray-500">Loading available times...</p>
              ) : slots.length === 0 ? (
                <p className="text-gray-500">
                  No available appointments for this date.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {slots.map((slot) => (
                    <TimeSlot
                      key={slot}
                      time={slot}
                      selected={selectedSlot === slot}
                      onClick={() => setSelectedSlot(slot)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={booking}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50"
          >
            {booking ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default BookAppointmentPage;
