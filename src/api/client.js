import axios from "axios";

/**
 * Cliente HTTP base para HoneyMetrics v2
 * Configurado con la URL base de Vite según el entorno (Development / Production).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout para evitar peticiones colgadas
});

/**
 * Interceptor de Solicitud (Request Interceptor)
 * Inyecta automáticamente el token JWT Bearer en el encabezado Authorization
 * si existe una sesión activa almacenada en el cliente.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuesta (Response Interceptor)
 * Maneja de forma centralizada los códigos de estado HTTP (401, 403, 500).
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si la API retorna 401 Unauthorized y no estamos en la pantalla de login, limpiar sesión
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      if (!isLoginRequest) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        // Opcional: Redirigir a login si la sesión caducó
        if (window.location.pathname !== "/login" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
