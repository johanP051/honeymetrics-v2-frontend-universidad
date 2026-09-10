import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function RoleGuard({ allowedRoles, children }) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated && !role) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-up">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-hm-danger/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-hm-danger/30">
            <ShieldAlert size={32} className="text-hm-danger" />
          </div>
          <h2 className="text-2xl font-display text-hm-danger mb-2">Acceso Denegado</h2>
          <p className="text-hm-muted mb-6">
            No tienes los permisos necesarios para visualizar este módulo.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
