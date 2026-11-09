import React from 'react';
import { Wifi, WifiOff, RefreshCw, Database } from 'lucide-react';

export const StatusBanner = ({
  error,
  isLoading,
  onRetry,
  isMockFallback,
  isFallback,
  endpoint = '/api/v1/threats/summary',
}) => {
  if (isMockFallback || isFallback) {
    return (
      <div className="border border-hm-gold/40 bg-hm-gold/10 text-hm-gold rounded-xl px-4 py-3 flex items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Database size={16} className="text-hm-gold shrink-0 animate-pulse" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold text-hm-gold">Modo Demostración Offline (CTI Contingency Vault): </span>
            <span className="text-hm-text">
              Visualizando telemetría pre-compilada de 165.000 logs reales de Honeypots mientras se restablece la conexión al backend.
            </span>
          </div>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 flex items-center gap-1.5 shrink-0 bg-hm-gold/20 hover:bg-hm-gold/30 border border-hm-gold/40 text-hm-gold rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Reconectar
          </button>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-hm-danger/40 bg-hm-danger/10 text-hm-danger rounded-xl px-4 py-3 flex items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <WifiOff size={18} className="text-hm-danger shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold text-hm-danger">Error de Conexión CTI: </span>
            <span className="text-hm-text">
              {error || 'Error de conexión con el motor CTI. Verifique que el backend esté en ejecución.'}
            </span>
          </div>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 flex items-center gap-1.5 shrink-0 bg-hm-danger/20 hover:bg-hm-danger/30 border border-hm-danger/40 text-hm-text rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-emerald-500/25 bg-emerald-500/10 text-hm-text rounded-xl px-4 py-2.5 flex items-center justify-between gap-4 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <Wifi size={16} className="text-emerald-400 shrink-0" />
        <div className="text-xs sm:text-sm">
          <span className="font-semibold text-emerald-400">Motor CTI Conectado: </span>
          <span className="text-hm-muted">
            Telemetría y métricas sincronizadas en tiempo real desde{' '}
            <code className="text-[11px] bg-hm-bg/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
              {endpoint}
            </code>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
