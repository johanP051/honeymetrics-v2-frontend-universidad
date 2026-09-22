import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guardián de Rutas (Route Guard)
 * Permite el acceso a los componentes hijos (Outlet) si existe sesión válida,
 * o redirige automáticamente a /Login si el usuario no está autenticado.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-hm-bg flex items-center justify-center text-hm-gold font-mono text-sm">
        Verificando sesión...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
