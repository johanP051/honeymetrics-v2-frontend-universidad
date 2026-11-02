import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../api/authService";
import {
  isTokenValid,
  parseJwtPayload,
  getScopesForRole,
  purgeAllAuthStorage,
} from "./authSecurity";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [role, setRole] = useState(() => {
    const t = authService.getToken();
    if (!t) return null;
    const payload = parseJwtPayload(t);
    return payload?.role || payload?.role_name || localStorage.getItem("hm_role") || null;
  });
  const [scopes, setScopes] = useState(() => {
    const t = authService.getToken();
    if (!t) return [];
    const payload = parseJwtPayload(t);
    if (Array.isArray(payload?.scopes) && payload.scopes.length > 0) return payload.scopes;
    try {
      const stored = JSON.parse(localStorage.getItem("hm_scopes") || "[]");
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch {}
    const r = payload?.role || payload?.role_name || localStorage.getItem("hm_role") || "Analista";
    return getScopesForRole(r);
  });
  const [loading, setLoading] = useState(true);

  const applyAuthSuccess = useCallback((tokenValue, userObject, scopesArray = null) => {
    const payload = parseJwtPayload(tokenValue);
    const resolvedRole = userObject?.role_name || payload?.role || payload?.role_name || "Analista";
    const resolvedScopes = Array.isArray(scopesArray) && scopesArray.length > 0
      ? scopesArray
      : (Array.isArray(payload?.scopes) && payload.scopes.length > 0
          ? payload.scopes
          : (Array.isArray(userObject?.scopes) && userObject.scopes.length > 0
              ? userObject.scopes
              : getScopesForRole(resolvedRole)));

    localStorage.setItem("access_token", tokenValue);
    localStorage.setItem("hm_access_token", tokenValue);
    localStorage.setItem("user_data", JSON.stringify(userObject || {}));
    localStorage.setItem("hm_user", JSON.stringify(userObject || {}));
    localStorage.setItem("hm_role", resolvedRole);
    localStorage.setItem("hm_scopes", JSON.stringify(resolvedScopes));

    setToken(tokenValue);
    setUser(userObject);
    setRole(resolvedRole);
    setScopes(resolvedScopes);
  }, []);

  useEffect(() => {
    const storedToken = authService.getToken();
    if (storedToken) {
      if (isTokenValid(storedToken)) {
        setToken(storedToken);
        const storedUser = authService.getCurrentUser();
        if (storedUser) setUser(storedUser);
      } else {
        purgeAllAuthStorage();
        setToken(null);
        setUser(null);
        setRole(null);
        setScopes([]);
      }
    }
    setLoading(false);

    const timer = setInterval(() => {
      const currentToken = authService.getToken();
      if (currentToken && !isTokenValid(currentToken)) {
        purgeAllAuthStorage();
        setToken(null);
        setUser(null);
        setRole(null);
        setScopes([]);
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?expired=1";
        }
      }
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data.mfa_required) {
      return data;
    }
    if (data.access_token) {
      applyAuthSuccess(data.access_token, data.user, data.scopes);
    }
    return data;
  };

  const verifyMfaLogin = async (mfaToken, code) => {
    const data = await authService.verifyMfaLogin(mfaToken, code);
    if (data.access_token) {
      applyAuthSuccess(data.access_token, data.user, data.scopes);
    }
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    setRole(null);
    setScopes([]);
  };

  const hasScope = useCallback(
    (requiredScope) => {
      if (!requiredScope) return true;
      const effectiveRole = role || user?.role_name || (typeof localStorage !== 'undefined' ? localStorage.getItem("hm_role") : null);
      if (effectiveRole && (effectiveRole.toLowerCase() === "administrador" || effectiveRole.toLowerCase() === "superusuario")) return true;
      if (scopes.includes(requiredScope) || scopes.includes("admin:all")) return true;
      const fallback = getScopesForRole(effectiveRole || 'Analista');
      return fallback.includes(requiredScope) || fallback.includes("admin:all");
    },
    [role, user, scopes]
  );

  const updateProfileData = useCallback(
    (updatedProfile) => {
      if (!updatedProfile) return;
      setUser((prev) => {
        const merged = { ...prev, ...updatedProfile };
        localStorage.setItem("user_data", JSON.stringify(merged));
        localStorage.setItem("hm_user", JSON.stringify(merged));
        return merged;
      });
      if (updatedProfile.role_name) {
        setRole(updatedProfile.role_name);
        localStorage.setItem("hm_role", updatedProfile.role_name);
      }
      if (Array.isArray(updatedProfile.scopes) && updatedProfile.scopes.length > 0) {
        setScopes(updatedProfile.scopes);
        localStorage.setItem("hm_scopes", JSON.stringify(updatedProfile.scopes));
      }
    },
    []
  );

  const value = {
    user,
    token,
    role,
    scopes,
    isAuthenticated: !!token,
    loading,
    login,
    verifyMfaLogin,
    logout,
    hasScope,
    updateProfileData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
}
