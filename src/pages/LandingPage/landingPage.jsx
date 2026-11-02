import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Activity, CheckCircle, Zap } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import AiOrbAnimation from '../../components/common/AiOrbAnimation';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const targetRoute = isAuthenticated ? '/dashboard' : '/login';

  const socMetrics = [
    { valor: '99%', etiqueta: 'Reducción de Falsos Positivos', icono: CheckCircle },
    { valor: '< 50ms', etiqueta: 'Latencia de Detección SOC', icono: Zap },
    { valor: '24/7', etiqueta: 'Telemetría Activa Honeypots', icono: Activity },
    { valor: '100%', etiqueta: 'Cobertura OWASP & CTI', icono: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-hm-bg flex flex-col relative overflow-hidden">
      {/* Header institucional */}
      <header className="w-full px-6 py-4 border-b border-hm-border/40 bg-hm-bg/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="HoneyMetrics Logo"
            className="w-9 h-9 object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          />
          <span className="text-xl font-display font-bold text-hm-gold tracking-wide">
            HoneyMetrics
          </span>
        </div>
        <Link
          to={targetRoute}
          className="px-5 py-2 rounded-lg bg-hm-gold text-hm-bg font-bold text-sm transition-all hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          {isAuthenticated ? 'Ir al Dashboard' : 'Ingresar'}
        </Link>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-12 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-hm-gold/30 bg-hm-gold/10 text-hm-gold text-xs font-mono uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SOC & Honeypot Telemetry Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-hm-text mb-6 leading-tight">
            Advanced <span className="text-hm-gold">Cyber Threat</span> Intelligence
          </h1>

          <p className="text-base sm:text-lg text-hm-muted mb-8 leading-relaxed max-w-2xl mx-auto">
            Plataforma de monitoreo, correlación de amenazas y análisis forense impulsada por Inteligencia Artificial y telemetría distribuida de honeypots.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              type="button"
              onClick={() => navigate(targetRoute)}
              className="group inline-flex items-center gap-3 px-8 py-3.5 bg-hm-gold text-hm-bg font-bold rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] text-base"
            >
              <ShieldAlert size={22} className="group-hover:animate-pulse" />
              <span>{isAuthenticated ? 'Ir al Centro de Control' : 'Ingresar a Plataforma'}</span>
            </button>
          </div>
        </div>

        {/* Métricas SOC */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-12 animate-fade-up">
          {socMetrics.map((metrica) => (
            <div
              key={metrica.etiqueta}
              className="glass-card p-4 rounded-xl border border-hm-border flex flex-col items-center text-center hover:border-hm-gold/40 transition-colors"
            >
              <metrica.icono size={22} className="text-hm-gold mb-2" />
              <span className="text-2xl sm:text-3xl font-display font-bold text-hm-gold">
                {metrica.valor}
              </span>
              <span className="text-xs text-hm-muted mt-1 font-medium">
                {metrica.etiqueta}
              </span>
            </div>
          ))}
        </div>

        {/* Esfera 3D interactiva */}
        <div className="w-full max-w-md opacity-90 animate-fade-up">
          <AiOrbAnimation />
        </div>
      </main>

      <Footer />
    </div>
  );
}