function TimeSlot({ time, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 rounded-lg border transition ${
        selected
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600"
      }`}
    >
      {time}
    </button>
  );
}

export default TimeSlot;
