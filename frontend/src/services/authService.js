import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("accounts/login/", {
    email,
    password,
  });

  const token = response.data.token;

  if (!token) {
    throw new Error("No authentication token received.");
  }

  sessionStorage.setItem("token", token);

  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("accounts/register/", userData);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("accounts/user/");

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch("accounts/user/", profileData);

  return response.data;
};

export const logout = async () => {
  try {
    await api.post("accounts/logout/");
  } finally {
    sessionStorage.removeItem("token");
  }
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem("token");
};
