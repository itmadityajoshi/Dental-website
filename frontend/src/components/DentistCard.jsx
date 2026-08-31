function DentistCard({ dentist }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold text-gray-800">{dentist.name}</h2>
      <p className="text-blue-500">{dentist.specialization}</p>
      <p className="text-gray-600 mt-2">{dentist.bio}</p>
    </div>
  );
}

export default DentistCard;
