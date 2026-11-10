import React from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';
import LogsActionButtons from './LogsActionButtons';

export function LogsStatusBadge({ status }) {
  const norm = String(status || '').toLowerCase();
  if (norm === 'listo' || norm === 'completado' || norm === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
        <span>{status || 'Listo'}</span>
      </span>
    );
  }
  if (norm.includes('pendiente')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <AlertCircle className="w-3 h-3" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }
  if (norm === 'procesando' || norm === 'en proceso') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
        <Clock className="w-3 h-3 animate-spin" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }
  if (norm === 'rechazada' || norm === 'error' || norm === 'fallido') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
        <XCircle className="w-3 h-3" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600/60">
      <span>{status}</span>
    </span>
  );
}

export default function LogsTableBody({
  cargando = false,
  totalRows = 0,
  error,
  estadosSeleccionados,
  rowsVisibles,
  rowsPerPage,
  page,
  descargandoId,
  generandoReporteId,
  onDownload,
  onGenerarReporte,
}) {
  const paginatedRows = rowsPerPage > 0
    ? rowsVisibles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rowsVisibles;

  if (cargando && rowsVisibles.length === 0) {
    return (
      <tbody className="divide-y divide-hm-border/40">
        <tr>
          <td colSpan={6} className="p-10 text-center text-hm-muted text-sm">
            <div className="inline-flex items-center gap-3" role="status" aria-label="Cargando historial de exportaciones">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-hm-gold border-t-transparent" />
              <span>Sincronizando historial de exportaciones...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (error && rowsVisibles.length === 0) {
    return (
      <tbody className="divide-y divide-hm-border/40">
        <tr>
          <td colSpan={6} className="p-8 text-center text-hm-danger text-sm font-medium">
            <div role="alert">{error}</div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (totalRows > 0 && !estadosSeleccionados.length) {
    return (
      <tbody className="divide-y divide-hm-border/40">
        <tr>
          <td colSpan={6} className="p-8 text-center text-hm-gold text-sm font-medium">
            Aplique al menos un filtro de estado para visualizar registros.
          </td>
        </tr>
      </tbody>
    );
  }

  if (rowsVisibles.length === 0) {
    return (
      <tbody className="divide-y divide-hm-border/40">
        <tr>
          <td colSpan={6} className="p-8 text-center text-hm-muted text-sm">
            No se encontraron exportaciones con los criterios especificados.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-hm-border/40">
      {paginatedRows.map((row) => (
        <tr key={row.id} className="hover:bg-hm-elevated/40 transition-colors">
          <td className="p-4 font-mono font-bold text-hm-gold text-xs sm:text-sm">{row.id}</td>
          <td className="p-4 text-xs sm:text-sm text-hm-text font-mono">{row.date_range}</td>
          <td className="p-4 text-xs sm:text-sm text-hm-text text-right font-mono">
            {Number(row.count || 0).toLocaleString('es-CO')}
          </td>
          <td className="p-4 text-xs sm:text-sm text-hm-muted text-right">{row.created_at}</td>
          <td className="p-4 text-center">
            <LogsStatusBadge status={row.status} />
          </td>
          <td className="p-4 text-right">
            <LogsActionButtons
              texto={row.status}
              exportId={row.id}
              descargandoId={descargandoId}
              generandoReporteId={generandoReporteId}
              onDownload={onDownload}
              onGenerarReporte={onGenerarReporte}
            />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
