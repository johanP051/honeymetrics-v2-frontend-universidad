import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../api/authService";
import {
  isTokenValid,
  parseJwtPayload,
  getScopesForRole,
  purgeAllAuthStorage,
  sanitizeRole,
  sanitizeScopes,
  sanitizeUserProfile,
} from "./authSecurity";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [role, setRole] = useState(() => {
    const t = authService.getToken();
    if (!t) return null;
    const payload = parseJwtPayload(t);
    return (
      sanitizeRole(payload?.role) ||
      sanitizeRole(payload?.role_name) ||
      sanitizeRole(localStorage.getItem("hm_role")) ||
      null
    );
  });
  const [scopes, setScopes] = useState(() => {
    const t = authService.getToken();
    if (!t) return [];
    const payload = parseJwtPayload(t);
    const tokenScopes = sanitizeScopes(payload?.scopes);
    if (tokenScopes.length > 0) return tokenScopes;
    try {
      const stored = sanitizeScopes(JSON.parse(localStorage.getItem("hm_scopes") || "[]"));
      if (stored.length > 0) return stored;
    } catch {}
    const r =
      sanitizeRole(payload?.role) ||
      sanitizeRole(payload?.role_name) ||
      sanitizeRole(localStorage.getItem("hm_role")) ||
      "Analista";
    return getScopesForRole(r);
  });
  const [loading, setLoading] = useState(true);

  const applyAuthSuccess = useCallback((tokenValue, userObject, scopesArray = null) => {
    purgeAllAuthStorage();
    const payload = parseJwtPayload(tokenValue);
    const safeUser = sanitizeUserProfile(userObject) || {};
    const resolvedRole =
      sanitizeRole(safeUser.role_name) ||
      sanitizeRole(payload?.role) ||
      sanitizeRole(payload?.role_name) ||
      "Analista";
    const requestedScopes = Array.isArray(scopesArray) && scopesArray.length > 0
      ? scopesArray
      : (Array.isArray(payload?.scopes) && payload.scopes.length > 0
          ? payload.scopes
          : (Array.isArray(safeUser.scopes) && safeUser.scopes.length > 0
              ? safeUser.scopes
              : getScopesForRole(resolvedRole)));
    const resolvedScopes = sanitizeScopes(requestedScopes);
    const serializedUser = JSON.stringify(safeUser);
    const serializedScopes = JSON.stringify(resolvedScopes);
    [localStorage, sessionStorage].forEach((storage) => {
      storage.setItem("access_token", tokenValue);
      storage.setItem("hm_access_token", tokenValue);
      storage.setItem("user_data", serializedUser);
      storage.setItem("hm_user", serializedUser);
      storage.setItem("hm_role", resolvedRole);
      storage.setItem("hm_scopes", serializedScopes);
    });

    setToken(tokenValue);
    setUser(safeUser);
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
    try {
      await authService.logout();
    } finally {
      purgeAllAuthStorage();
      setToken(null);
      setUser(null);
      setRole(null);
      setScopes([]);
    }
  };

  const hasScope = useCallback(
    (requiredScope) => {
      if (!requiredScope) return true;
      const effectiveRole =
        sanitizeRole(role) ||
        sanitizeRole(user?.role_name) ||
        (typeof localStorage !== 'undefined' ? sanitizeRole(localStorage.getItem("hm_role")) : null);
      if (effectiveRole && (effectiveRole.toLowerCase() === "administrador" || effectiveRole.toLowerCase() === "superusuario")) return true;
      if (scopes.includes(requiredScope) || scopes.includes("admin:all")) return true;
      const fallback = getScopesForRole(effectiveRole || 'Analista');
      return fallback.includes(requiredScope) || fallback.includes("admin:all");
    },
    [role, user, scopes]
  );

  const updateProfileData = useCallback(
    (updatedProfile) => {
      const safeProfile = sanitizeUserProfile(updatedProfile);
      if (!safeProfile || Object.keys(safeProfile).length === 0) return;
      setUser((prev) => {
        const merged = { ...(sanitizeUserProfile(prev) || {}), ...safeProfile };
        const serialized = JSON.stringify(merged);
        if (prev && JSON.stringify(prev) === serialized) return prev;
        localStorage.setItem("user_data", serialized);
        localStorage.setItem("hm_user", serialized);
        sessionStorage.setItem("user_data", serialized);
        sessionStorage.setItem("hm_user", serialized);
        return merged;
      });
      if (safeProfile.role_name) {
        setRole((prev) => (prev === safeProfile.role_name ? prev : safeProfile.role_name));
        localStorage.setItem("hm_role", safeProfile.role_name);
        sessionStorage.setItem("hm_role", safeProfile.role_name);
      }
      if (Array.isArray(safeProfile.scopes) && safeProfile.scopes.length > 0) {
        setScopes((prev) => {
          const json = JSON.stringify(safeProfile.scopes);
          if (JSON.stringify(prev) === json) return prev;
          localStorage.setItem("hm_scopes", json);
          sessionStorage.setItem("hm_scopes", json);
          return safeProfile.scopes;
        });
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
