import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {

  const token =
    localStorage.getItem("token");

  const url = config.url || "";

  const isAuthRoute =
    url.includes("/auth/login") ||
    url.includes("/auth/register");

  if (token && !isAuthRoute) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;