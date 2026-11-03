import React from 'react';
import { Download, FileText, Send, Clock, Loader2 } from 'lucide-react';

export default function LogsActionButtons({
  texto,
  exportId,
  descargandoId,
  generandoReporteId,
  onDownload,
  onGenerarReporte,
}) {
  const norm = String(texto || '').toLowerCase();

  if (norm === 'listo' || norm === 'completado' || norm === 'completed') {
    return (
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onDownload(exportId)}
          disabled={descargandoId === exportId}
          aria-label={`Descargar archivo JSONL de exportación ${exportId}`}
          title="Descargar archivo crudo JSONL"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {descargandoId === exportId ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>JSONL</span>
        </button>

        <button
          type="button"
          onClick={() => onGenerarReporte(exportId)}
          disabled={generandoReporteId === exportId}
          aria-label={`Generar reporte PDF de exportación ${exportId}`}
          title="Generar reporte forense PDF"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {generandoReporteId === exportId ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>PDF</span>
        </button>
      </div>
    );
  }

  if (norm.includes('pendiente')) {
    return (
      <div className="flex items-center justify-end" role="status">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md">
          <Send className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span>Esperando Telegram</span>
        </span>
      </div>
    );
  }

  if (norm === 'procesando' || norm === 'en proceso') {
    return (
      <div className="flex items-center justify-end" role="status">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-md animate-pulse">
          <Clock className="w-3.5 h-3.5 animate-spin text-blue-400" aria-hidden="true" />
          <span>En cola Celery...</span>
        </span>
      </div>
    );
  }

  return (
    <div className="text-right">
      <span className="text-slate-500 text-sm" aria-label="Sin acciones disponibles">—</span>
    </div>
  );
}
