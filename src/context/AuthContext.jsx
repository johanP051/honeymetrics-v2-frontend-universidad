import React, { createContext, useState, useContext } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hm_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('hm_role') || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('hm_role');
  });

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.status === 200) {
      const loggedUser = { email };
      const assignedRole = response.data?.user?.role || 'Analista';
      setUser(loggedUser);
      setRole(assignedRole);
      setIsAuthenticated(true);
      localStorage.setItem('hm_user', JSON.stringify(loggedUser));
      localStorage.setItem('hm_role', assignedRole);
    }
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hm_user');
    localStorage.removeItem('hm_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

