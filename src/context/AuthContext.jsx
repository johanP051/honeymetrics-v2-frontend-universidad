import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/authService";

const AuthContext = createContext(null);

const parseJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 > Date.now();
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar estado de autenticación al cargar la aplicación validando expiración
  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getCurrentUser();

    if (storedToken) {
      if (isTokenValid(storedToken)) {
        setToken(storedToken);
        if (storedUser) {
          setUser(storedUser);
        }
      } else {
        authService.logout();
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);

    // Monitoreo proactivo de la expiración del token
    const timer = setInterval(() => {
      const currentToken = authService.getToken();
      if (currentToken && !isTokenValid(currentToken)) {
        authService.logout();
        setToken(null);
        setUser(null);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login?expired=1";
        }
      }
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Iniciar sesión, guardar JWT y actualizar estado reactivo
   */
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // data: { access_token, token_type, user }
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      setToken(data.access_token);
    }

    if (data.user) {
      localStorage.setItem("user_data", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      localStorage.removeItem("user_data");
      setUser(null);
    }

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
