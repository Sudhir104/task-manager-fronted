import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-backend-production-07c9.up.railway.app/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
