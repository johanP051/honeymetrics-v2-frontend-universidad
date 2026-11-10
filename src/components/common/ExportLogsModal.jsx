import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, AlertTriangle, X, Send, Loader2 } from 'lucide-react';
import api, { formatApiErrorDetail } from '../../api/client';
import useModalA11y from '../../hooks/useModalA11y';

export default function ExportLogsModal({ open, onClose, onSubmit, onExportSuccess }) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const handleClose = () => {
    setErrorValidacion('');
    setMensajeExito('');
    if (onClose) onClose();
  };

  const modalRef = useModalA11y({
    isOpen: Boolean(open),
    onClose: handleClose,
    isLoading: cargando,
  });

  if (!open) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const solicitarLogs = async () => {
    if (!fechaInicio || !fechaFinal) {
      setErrorValidacion('Completa tanto la fecha de inicio como la de fin.');
      return false;
    }
    if (fechaInicio > todayStr || fechaFinal > todayStr) {
      setErrorValidacion('Las fechas no pueden ser posteriores a hoy.');
      return false;
    }
    if (fechaInicio > fechaFinal) {
      setErrorValidacion('La fecha de inicio no puede ser posterior a la de fin.');
      return false;
    }
    setErrorValidacion('');
    setCargando(true);
    try {
      const { data } = await api.post('/logs/request-export', { start_date: fechaInicio, end_date: fechaFinal });
      setMensajeExito('Solicitud de exportación registrada exitosamente.');
      if (onExportSuccess) onExportSuccess(data);
      setFechaInicio(''); setFechaFinal('');
      setTimeout(handleClose, 600);
      return true;
    } catch (error) {
      console.warn('Error al solicitar exportación de logs:', error);
      if (error?.response) {
        const errorMsg = formatApiErrorDetail(
          error.response?.data?.detail,
          'Error al procesar la exportación de logs.'
        );
        setErrorValidacion(errorMsg);
        return false;
      }
      setErrorValidacion(error?.message || 'Error de conexión al procesar la exportación.');
      return false;
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await solicitarLogs();
    if (ok && onSubmit) onSubmit({ fechaInicio, fechaFinal });
  };


  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        ref={modalRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-export-logs-title"
        className="w-full max-w-md bg-hm-card border border-hm-border rounded-xl shadow-2xl p-6 text-hm-text relative outline-none"
      >
        <div className="flex items-center justify-between pb-3 border-b border-hm-border/60 mb-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-hm-gold" aria-hidden="true" />
            <h2 id="modal-export-logs-title" className="text-xl font-bold font-display text-hm-text">
              Nuevo Export de Logs
            </h2>
          </div>
          <button type="button" onClick={handleClose} aria-label="Cerrar modal" className="text-hm-muted hover:text-hm-text p-1.5 rounded-lg hover:bg-hm-elevated transition-colors">
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-hm-gold/10 border border-hm-gold/30 text-hm-gold text-xs mb-4">
          <AlertTriangle className="w-4 h-4 text-hm-gold shrink-0 mt-0.5" aria-hidden="true" />
          <p id="modal-security-text" className="text-hm-text/90">
            <strong className="text-hm-gold">Nota de Seguridad:</strong> Solicitudes mayores a <strong className="text-hm-text">50,000 registros</strong> requieren confirmación vía <strong className="text-hm-gold">Telegram</strong>.
          </p>
        </div>

        {errorValidacion && (
          <div role="alert" className="mb-4 bg-hm-danger/10 border border-hm-danger/30 text-hm-danger p-2.5 rounded-lg text-xs">
            {errorValidacion}
          </div>
        )}
        {mensajeExito && (
          <div role="status" className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-xs">
            {mensajeExito}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="fecha-inicio" className="block text-xs font-semibold uppercase tracking-wider text-hm-muted mb-1">
              Fecha Inicio <span className="text-hm-gold">*</span>
            </label>
            <input
              id="fecha-inicio"
              type="date"
              required
              max={todayStr}
              style={{ colorScheme: 'dark' }}
              value={fechaInicio}
              onChange={(e) => { setFechaInicio(e.target.value); if (errorValidacion) setErrorValidacion(''); }}
              className="w-full bg-hm-elevated border border-hm-border rounded-lg px-3 py-2 text-hm-text text-sm focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          <div>
            <label htmlFor="fecha-fin" className="block text-xs font-semibold uppercase tracking-wider text-hm-muted mb-1">
              Fecha Fin <span className="text-hm-gold">*</span>
            </label>
            <input
              id="fecha-fin"
              type="date"
              required
              max={todayStr}
              style={{ colorScheme: 'dark' }}
              value={fechaFinal}
              onChange={(e) => { setFechaFinal(e.target.value); if (errorValidacion) setErrorValidacion(''); }}
              className="w-full bg-hm-elevated border border-hm-border rounded-lg px-3 py-2 text-hm-text text-sm focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          <div className="pt-3 border-t border-hm-border/60 flex items-center justify-end gap-3">
            <button type="button" onClick={handleClose} disabled={cargando} className="px-4 py-2 rounded-lg text-sm font-medium border border-hm-border text-hm-muted hover:text-hm-text hover:bg-hm-elevated transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={cargando} className="px-4 py-2 rounded-lg text-sm font-bold bg-hm-gold hover:bg-hm-goldHover text-slate-950 transition-colors shadow-lg shadow-hm-gold/20 flex items-center gap-2 disabled:opacity-50">
              {cargando ? (
                <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /><span>Solicitando...</span></>
              ) : (
                <><Send className="w-4 h-4" aria-hidden="true" /><span>Solicitar Export</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
