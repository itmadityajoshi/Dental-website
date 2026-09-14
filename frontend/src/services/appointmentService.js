import api from "./api";

export const getAppointments = async () => {
  const response = await api.get("/api/appointments/");
  return response.data;
};

export const createAppointment = async (data) => {
  const response = await api.post("/api/appointments/create/", data);

  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.patch(`/api/appointments/${id}/cancel/`);

  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await api.patch(`/api/appointments/${id}/`, { status });

  return response.data;
};
