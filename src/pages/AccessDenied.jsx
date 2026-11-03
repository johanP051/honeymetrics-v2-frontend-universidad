import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDefaultRoute } from '../context/authSecurity';

export default function AccessDenied({ moduleName = 'este módulo' }) {
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const controlCenterPath = getDefaultRoute(auth);

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      void navigate(-1);
    } else {
      void navigate(controlCenterPath, { replace: true });
    }
  };

  return (
    <main className="min-h-screen bg-hm-bg flex flex-col items-center justify-center p-4">
      <section
        className="glass-card max-w-md w-full p-8 text-center animate-fade-up border border-hm-border relative overflow-hidden"
        aria-labelledby="access-denied-title"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-hm-danger/10 rounded-full blur-[50px] pointer-events-none" />

        <div className="w-20 h-20 mx-auto mb-6 bg-hm-danger/10 border border-hm-danger/30 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
          <ShieldAlert size={40} className="text-hm-danger" aria-hidden="true" />
        </div>

        <p className="text-5xl font-display font-bold text-white mb-2 relative z-10 tracking-wider" aria-hidden="true">
          403
        </p>
        <h1 id="access-denied-title" className="text-xl font-medium text-hm-danger mb-4 relative z-10">
          Acceso Denegado
        </h1>

        <p className="text-hm-muted mb-8 relative z-10 text-sm leading-relaxed">
          Tu perfil no tiene autorización para acceder a {moduleName}. Si crees que debería tenerla,
          solicita la habilitación a un administrador.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg border border-hm-border bg-hm-elevated text-hm-text text-sm font-semibold hover:border-hm-gold/40 hover:text-hm-gold transition-all"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Volver Atrás</span>
          </button>

          <Link
            to={controlCenterPath}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-hm-gold text-hm-bg text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all"
          >
            <Home size={16} aria-hidden="true" />
            <span>Centro de Control</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
