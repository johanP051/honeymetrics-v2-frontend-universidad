import api from "./client";

/**
 * Servicio de Autenticación de HoneyMetrics v2
 * Consume el contrato DTO del backend: POST /api/v1/auth/login
 */
export const authService = {
  /**
   * Autenticar usuario con credenciales y obtener JWT + perfil
   * @param {string} email - Correo del usuario
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<{ access_token: string, token_type: string, user: object }>}
   */
  async login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Cerrar sesión y purgar credenciales locales
   */
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
  },

  /**
   * Obtener el token actual almacenado
   */
  getToken() {
    return localStorage.getItem("access_token");
  },

  /**
   * Obtener los datos del usuario almacenados
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user_data");
    if (!userStr || userStr === "undefined" || userStr === "null") {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      localStorage.removeItem("user_data");
      return null;
    }
  },

  /**
   * Verificar si existe una sesión activa
   */
  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};
