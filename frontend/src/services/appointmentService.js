import api from "./api";

export const getAppointments = async () => {
  const response = await api.get("appointments/");
  return response.data;
};

export const createAppointment = async (data) => {
  const response = await api.post("appointments/create/", data);

  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.get(`appointments/${id}/cancel/`);

  return response.data;
};
