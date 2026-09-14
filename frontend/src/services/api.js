import axios from "axios";

const URL = "http://localhost:8006/api";
export { URL };

const api = axios.create({
  baseURL: URL,
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