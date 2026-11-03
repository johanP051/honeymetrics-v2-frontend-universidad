import axios from "axios";
import { purgeAllAuthStorage } from "../context/authSecurity.js";

/**
 * Normaliza cualquier payload `detail` de FastAPI / Pydantic (incluyendo arrays 422)
 * a un string legible por humanos para evitar React Error #31 al renderizar alertas.
 */
export const formatApiErrorDetail = (detail, fallback = "Error al procesar la solicitud.") => {
  if (!detail) return fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const cleanMsg = String(item.msg || item.message || JSON.stringify(item))
            .replace(/^Value error,\s*/i, "")
            .trim();
          const field = Array.isArray(item.loc) && item.loc.length > 1
            ? `${item.loc[item.loc.length - 1]}: `
            : "";
          return `${field}${cleanMsg}`;
        }
        return String(item);
      })
      .filter(Boolean);
    return messages.length > 0 ? messages.join(" · ") : fallback;
  }
  if (typeof detail === "object") {
    return String(detail.message || detail.msg || detail.detail || fallback);
  }
  return String(detail);
};

export const isMockModeEnabled = () => {
  if (!import.meta.env?.DEV) return false;
  const envVal = String(import.meta.env?.VITE_USE_MOCKS || "").trim().toLowerCase();
  return envVal === "true" || envVal === "1";
};

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://localhost:8001/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("hm_access_token") ||
      localStorage.getItem("hm_access_token") ||
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data && error.response.data.detail !== undefined && typeof error.response.data.detail !== "string") {
      error.response.data.rawDetail = error.response.data.detail;
      error.response.data.detail = formatApiErrorDetail(error.response.data.detail);
    }

    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      const isAuthRequest =
        url.includes("/auth/login") ||
        url.includes("/auth/mfa") ||
        url.includes("/users/me/mfa") ||
        url.includes("/auth/forgot-password") ||
        url.includes("/auth/reset-password");

      if (!isAuthRequest) {
        purgeAllAuthStorage();
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?expired=1";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = api;
export default api;
