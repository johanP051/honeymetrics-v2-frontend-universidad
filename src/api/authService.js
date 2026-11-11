import api from "./client";
import { purgeAllAuthStorage, sanitizeUserProfile } from "../context/authSecurity";

export const authService = {
  async login(email, password) {
    purgeAllAuthStorage();
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async verifyMfaLogin(mfaToken, code) {
    const response = await api.post("/auth/mfa/verify-login", {
      mfa_token: mfaToken,
      code,
    });
    return response.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Silencioso ante desconexión de red
    } finally {
      purgeAllAuthStorage();
    }
  },

  getToken() {
    return (
      sessionStorage.getItem("hm_access_token") ||
      localStorage.getItem("hm_access_token") ||
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token")
    );
  },

  getCurrentUser() {
    const userStr =
      sessionStorage.getItem("hm_user") ||
      localStorage.getItem("hm_user") ||
      sessionStorage.getItem("user_data") ||
      localStorage.getItem("user_data");
    if (!userStr || userStr === "undefined" || userStr === "null") return null;
    try {
      return sanitizeUserProfile(JSON.parse(userStr));
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
