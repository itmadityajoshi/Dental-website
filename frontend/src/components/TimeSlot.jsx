function TimeSlot({ time, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 rounded-lg border transition ${
        selected
          ? "bg-teal-600 text-white border-teal-600"
          : "bg-white text-slate-700 border-slate-300 hover:border-teal-500 hover:text-teal-700"
      }`}
    >
      {time}
    </button>
  );
}

export default TimeSlot;
