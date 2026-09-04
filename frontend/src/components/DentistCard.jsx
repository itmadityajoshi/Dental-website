import { useNavigate } from "react-router-dom";
import { doctorName, mediaUrl } from "../utils/display";

function DentistCard({ dentist }) {
  const navigate = useNavigate();
  const photoUrl = mediaUrl(dentist.photo);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-blue-50 flex items-center justify-center">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={doctorName(dentist.name)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
            👨‍⚕️
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">
          {doctorName(dentist.name)}
        </h3>

        <p className="text-teal-700 mt-1">{dentist.specialization}</p>

        <p className="text-gray-500 text-sm mt-3">
          Experienced dental professional dedicated to patient care.
        </p>

        <button
          onClick={() => navigate(`/dentists/${dentist.id}`)}
          className="mt-5 w-full py-3 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

export default DentistCard;
