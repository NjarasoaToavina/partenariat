import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8006/api",
  headers: {
    Accept: "application/json",
  },
});

// Intercepteur pour injecter automatiquement le Token Bearer
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;