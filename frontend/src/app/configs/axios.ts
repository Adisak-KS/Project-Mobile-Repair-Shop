import axios from "axios";
import { getAccessToken, removeAccessToken } from "../services/tokenService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
//   baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
});

// Request interceptor - แนบ token ทุกครั้งที่เรียก API
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - จัดการ error responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Token หมดอายุหรือไม่ถูกต้อง
    if (error.response?.status === 401) {
      // ลบ token และ redirect ไป login
      removeAccessToken();

      // ถ้าไม่ใช่หน้า signin/signup ให้ redirect
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/signin") && !currentPath.includes("/signup")) {
          window.location.href = "/signin";
        }
      }
    }

    // ไม่มีสิทธิ์เข้าถึง
    if (error.response?.status === 403) {
      console.error("Permission denied:", error.response.data.message);
      // สามารถแสดง notification หรือ redirect ได้
    }

    return Promise.reject(error);
  }
);

export default api;
