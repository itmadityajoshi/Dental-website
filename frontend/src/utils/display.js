export function doctorName(name, fallback = "Dentist") {
  if (!name) return fallback;
  return name.startsWith("Dr.") ? name : `Dr. ${name}`;
}

export function mediaUrl(path) {
  if (!path) return null;
  return path.startsWith("http")
    ? path
    : `http://127.0.0.1:8000${path.startsWith("/") ? path : `/${path}`}`;
}
