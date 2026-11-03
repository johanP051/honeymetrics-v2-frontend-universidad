import React from 'react';
import { Wifi, WifiOff, RefreshCw, Database } from 'lucide-react';

export const StatusBanner = ({ error, isLoading, onRetry, isMockFallback, isFallback }) => {
  if (isMockFallback || isFallback) {
    return (
      <div className="border border-amber-500/40 bg-amber-500/10 text-amber-300 rounded-xl p-3.5 mb-6 flex items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-amber-400 shrink-0 animate-pulse" />
          <div className="text-sm">
            <span className="font-semibold text-amber-400">Modo Demostración Offline (CTI Contingency Vault): </span>
            <span className="text-slate-300">
              Visualizando telemetría pre-compilada de 165.000 logs reales de Honeypots mientras se restablece la conexión al backend.
            </span>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 flex items-center gap-1.5 shrink-0 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg transition-colors disabled:opacity-50"
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
      <div className="border border-red-500/40 bg-red-500/10 text-red-300 rounded-xl p-4 mb-6 flex items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <WifiOff size={20} className="text-red-400 shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-red-400">Error de Conexión CTI: </span>
            <span className="text-slate-300">
              {error || 'Error de conexión con el motor CTI. Verifique que el backend esté en ejecución.'}
            </span>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 flex items-center gap-1.5 shrink-0 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-emerald-500/30 bg-emerald-500/10 text-slate-200 rounded-xl p-3.5 mb-6 flex items-center justify-between gap-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Wifi size={18} className="text-emerald-400 shrink-0" />
        <div className="text-sm">
          <span className="font-semibold text-emerald-400">Motor CTI Conectado: </span>
          <span className="text-slate-300">
            Telemetría y métricas sincronizadas en tiempo real desde{' '}
            <code className="text-xs bg-slate-900/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
              /api/v1/threats/summary
            </code>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
