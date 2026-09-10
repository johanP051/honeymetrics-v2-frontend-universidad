import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, AlertTriangle, Send } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, onRequestExport, isSubmitting }) {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setValidationError('Por favor seleccione ambas fechas.');
      return;
    }
    if (startDate > today || endDate > today) {
      setValidationError('No puedes seleccionar fechas futuras.');
      return;
    }
    if (startDate > endDate) {
      setValidationError('La fecha de inicio debe ser anterior o igual a la fecha final.');
      return;
    }

    setValidationError('');
    onRequestExport(startDate, endDate);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative border border-hm-border shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-hm-muted hover:text-hm-danger transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-display text-hm-gold mb-4 flex items-center gap-2">
          <Calendar size={22} />
          Nuevo Export de Logs
        </h2>

        {/* Nota informativa de aprobación por Telegram (PB-HM-37 a 41) */}
        <div className="border border-hm-gold/30 bg-hm-gold/10 rounded-lg p-3 mb-5 flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-hm-gold shrink-0 mt-0.5" />
          <p className="text-xs text-hm-text leading-relaxed">
            <strong>Nota de Seguridad:</strong> Las solicitudes que superen los <strong>50,000 registros</strong> (o más de 7 días) requerirán aprobación manual del Administrador vía <strong>Telegram</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-hm-muted mb-1 uppercase tracking-wide">
              Fecha Inicio
            </label>
            <input
              type="date"
              required
              max={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-hm-bg border border-hm-border rounded-lg px-3 py-2 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-hm-muted mb-1 uppercase tracking-wide">
              Fecha Fin
            </label>
            <input
              type="date"
              required
              max={today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-hm-bg border border-hm-border rounded-lg px-3 py-2 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          {validationError && (
            <p className="text-xs text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-2 text-center">
              {validationError}
            </p>
          )}

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm text-hm-muted hover:bg-hm-elevated hover:text-hm-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-hm-gold text-hm-bg font-semibold rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] text-sm disabled:opacity-50"
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Solicitando...' : 'Solicitar Export'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
