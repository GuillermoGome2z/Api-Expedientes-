import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

// Si luego usas JWT:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
