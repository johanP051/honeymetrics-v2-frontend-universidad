import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { isTokenValid } from '../../context/authSecurity';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error no controlado en la interfaz:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  getControlCenterHref = () => {
    if (typeof window === 'undefined') return '/';
    const token = window.sessionStorage.getItem('hm_access_token') || window.localStorage.getItem('hm_access_token');
    return isTokenValid(token) ? '/dashboard' : '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-hm-bg flex flex-col items-center justify-center p-4">
        <section
          className="glass-card max-w-md w-full p-8 text-center animate-fade-up border border-hm-border relative overflow-hidden"
          aria-labelledby="unexpected-error-title"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-hm-gold/10 rounded-full blur-[50px] pointer-events-none" />
          <div className="w-20 h-20 mx-auto mb-6 bg-hm-elevated border border-hm-gold/30 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
            <AlertTriangle size={40} className="text-hm-gold" aria-hidden="true" />
          </div>
          <p className="text-5xl font-display font-bold text-white mb-2 relative z-10" aria-hidden="true">
            500
          </p>
          <h1 id="unexpected-error-title" className="text-xl font-medium text-hm-gold mb-4 relative z-10">
            Algo salió mal
          </h1>
          <p className="text-hm-muted mb-8 relative z-10 text-sm leading-relaxed">
            Ocurrió un error inesperado al cargar esta vista. Puedes reintentar o volver al Centro de Control.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <button
              type="button"
              onClick={this.handleRetry}
              className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg border border-hm-border bg-hm-elevated text-hm-text text-sm font-semibold hover:border-hm-gold/40 hover:text-hm-gold transition-all"
            >
              <RefreshCw size={16} aria-hidden="true" />
              <span>Reintentar</span>
            </button>
            <a
              href={this.getControlCenterHref()}
              className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-hm-gold text-hm-bg text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all"
            >
              <Home size={16} aria-hidden="true" />
              <span>Centro de Control</span>
            </a>
          </div>
        </section>
      </main>
    );
  }
}
