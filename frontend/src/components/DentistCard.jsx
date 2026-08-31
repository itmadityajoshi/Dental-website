`DentistCard.jsx`;

function DentistCard({ dentist }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition">
      {/* Dentist Image */}
      <div className="h-52 bg-gray-100 flex items-center justify-center">
        {dentist.image ? (
          <img
            src={dentist.image}
            alt={dentist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl text-blue-600">
              {dentist.name?.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900">{dentist.name}</h2>

        <p className="text-sm text-blue-600 mt-1">{dentist.specialization}</p>

        {dentist.description && (
          <p className="text-sm text-gray-500 mt-3 line-clamp-2">
            {dentist.description}
          </p>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100">
          <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
            View profile →
          </button>
        </div>
      </div>
    </div>
  );
}

export default DentistCard;
