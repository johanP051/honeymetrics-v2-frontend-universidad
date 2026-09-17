import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar estado de autenticación al cargar la aplicación
  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getCurrentUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  /**
   * Iniciar sesión, guardar JWT y actualizar estado reactivo
   */
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // data: { access_token, token_type, user }
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_data", JSON.stringify(data.user));

    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  /**
   * Cerrar sesión y resetear estados
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizado para consumir el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
}
