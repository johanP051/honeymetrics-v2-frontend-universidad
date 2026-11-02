import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDefaultRoute } from '../context/authSecurity';

export default function NotFound() {
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const controlCenterPath = getDefaultRoute(auth);

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(controlCenterPath, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-hm-bg flex flex-col items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center animate-fade-up border border-hm-border relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-hm-gold/10 rounded-full blur-[50px] pointer-events-none" />

        <div className="w-20 h-20 mx-auto mb-6 bg-hm-elevated border border-hm-border rounded-2xl flex items-center justify-center shadow-lg relative z-10">
          <ShieldAlert size={40} className="text-hm-gold" />
        </div>

        <h1 className="text-5xl font-display font-bold text-white mb-2 relative z-10 tracking-wider">
          404
        </h1>
        <h2 className="text-xl font-medium text-hm-gold mb-4 relative z-10">
          Objetivo No Encontrado
        </h2>
        
        <p className="text-hm-muted mb-8 relative z-10 text-sm leading-relaxed">
          La ruta solicitada no existe en la arquitectura del sistema CTI o ha sido reclasificada por políticas de seguridad.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg border border-hm-border bg-hm-elevated text-hm-text text-sm font-semibold hover:border-hm-gold/40 hover:text-hm-gold transition-all"
          >
            <ArrowLeft size={16} />
            <span>Volver Atrás</span>
          </button>
          
          <Link 
            to={controlCenterPath} 
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-hm-gold text-hm-bg text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all"
          >
            <Home size={16} />
            <span>Centro de Control</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
