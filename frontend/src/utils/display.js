export function doctorName(name, fallback = "Dentist") {
  if (!name) return fallback;
  return name.startsWith("Dr.") ? name : `Dr. ${name}`;
}

export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const mediaBaseUrl =
    import.meta.env.VITE_MEDIA_URL || "http://127.0.0.1:8000";
  return `${mediaBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
