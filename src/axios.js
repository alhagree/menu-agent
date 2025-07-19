// src/views/client/axios.js
import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}/api/agent`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("client_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if ([401, 403].includes(error?.response?.status)) {
      alert("⛔ انتهت الجلسة، يرجى تسجيل الدخول مجددًا.");
      localStorage.removeItem("client_token");
      router.push("/"); // صفحة تسجيل دخول العميل
    }
    return Promise.reject(error);
  }
);

export default api;
