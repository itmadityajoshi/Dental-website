import api from "./api";

export const getDentists = async () => {
  const response = await api.get("dentists/");
  return response.data;
};

export const getDentist = async (id) => {
  const response = await api.get(`dentists/${id}/`);
  return response.data;
};

export const getAvailableSlots = async (dentistId, date) => {
  const response = await api.get(
    `dentists/${dentistId}/available-slots/?date=${date}`,
  );

  return response.data;
};
