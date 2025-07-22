import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}/api/agent`, // ✅ صحيح
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
    const status = error?.response?.status;
    const errorCode = error?.response?.data?.error_code;

    // فقط نعيد التوجيه إذا لم تكن رسالة دخول
    const isAuthError =
      (status === 401 || status === 403) &&
      ![
        "invalid_credentials",
        "account_inactive",
        "subscription_inactive",
        "subscription_expired",
      ].includes(errorCode);

    if (isAuthError) {
      alert("⛔ انتهت الجلسة، يرجى تسجيل الدخول مجددًا.");
      localStorage.removeItem("client_token");
      router.push("/");
    }

    return Promise.reject(error);
  }
);

export default api;
