import axios from "axios";

export const api = axios.create({
  // En dev funciona por el proxy de Vite (vite.config.ts)
  baseURL: "/api",
});

// Inyectar token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejar 401/403: limpiar sesión y redirigir a /login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // redirigir al login
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
