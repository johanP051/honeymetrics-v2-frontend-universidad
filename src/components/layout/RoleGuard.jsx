import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AccessDenied from '../../pages/AccessDenied';

export default function RoleGuard({ allowedRoles, requiredScope, children }) {
  const { role, user, isAuthenticated, hasScope } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !role) {
    return <Navigate to="/login" replace />;
  }

  // Enjaulado Fail-Closed: Si el usuario debe cambiar su clave temporal, confinarlo a /settings
  if (user?.must_change_password && location.pathname !== '/settings') {
    return <Navigate to="/settings?forcePassword=1" replace />;
  }

  // 1. Verificación primaria por Scope / Permiso (PBAC)
  if (requiredScope) {
    if (!hasScope(requiredScope)) {
      return <AccessDenied />;
    }
    return <>{children}</>;
  }

  // 2. Compatibilidad secundaria si solo se proporciona allowedRoles
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
