import React from 'react';
import { Wifi, WifiOff, RefreshCw, Database } from 'lucide-react';

export const StatusBanner = ({ error, isLoading, onRetry, isMockFallback }) => {
  if (isMockFallback) {
    return (
      <div className="border border-hm-gold/40 bg-hm-gold/10 text-hm-gold rounded-xl p-3.5 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-hm-gold shrink-0 animate-pulse" />
          <div className="text-sm">
            <span className="font-semibold text-hm-gold">Modo Demostración Offline (CTI Contingency Vault): </span>
            <span className="text-hm-text">Visualizando telemetría pre-compilada de 165.000 logs reales de Honeypots mientras se restablece la conexión al backend.</span>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isLoading}
            className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 shrink-0 bg-hm-gold/20 hover:bg-hm-gold/30 border border-hm-gold/40 text-hm-gold"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Reconectar
          </button>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-hm-danger/30 bg-hm-danger/10 text-hm-danger rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <WifiOff size={20} className="text-hm-danger shrink-0" />
          <div className="text-sm">
            <span className="font-semibold">Error de Conexión CTI: </span>
            <span>{error || 'Error de conexión con el motor CTI. Verifique que el backend esté en ejecución.'}</span>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isLoading}
            className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 shrink-0 bg-hm-danger/20 hover:bg-hm-danger/30 border border-hm-danger/40 text-hm-text"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-hm-success/30 bg-hm-success/10 text-hm-text rounded-xl p-3.5 mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Wifi size={18} className="text-hm-success shrink-0" />
        <div className="text-sm">
          <span className="font-semibold text-hm-success">Motor CTI Conectado: </span>
          <span className="text-hm-muted">Telemetría y métricas sincronizadas en tiempo real desde <code>/api/v1/threats/summary</code>.</span>
        </div>
      </div>
    </div>
  );
};
