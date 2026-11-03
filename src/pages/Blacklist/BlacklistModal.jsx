import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useModalA11y } from '../../hooks/useModalA11y';

const CATEGORIES = ['Botnet', 'APT', 'Scanner', 'Recon', 'BruteForce', 'DDoS', 'Malware'];

function getIpType(ip) {
  if (typeof ip !== 'string') return null;
  const parts = ip.split('.');
  if (parts.length === 4 && parts.every((p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255)) return 'IPv4';
  if (ip.includes(':')) return 'IPv6';
  return null;
}

export default function BlacklistModal({ open, onClose, onSubmit, threatToEdit = null }) {
  const modalRef = useRef(null);
  useModalA11y({ isOpen: Boolean(open), onClose, containerRef: modalRef });

  const [ip, setIp] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('Botnet');
  const [threatScore, setThreatScore] = useState(50);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (threatToEdit) {
      setIp(threatToEdit.ip || '');
      setCountry(threatToEdit.country || '');
      setCategory(threatToEdit.category || 'Botnet');
      setThreatScore(Number(threatToEdit.threat_score ?? 50));
      setNotes(threatToEdit.notes || '');
    } else {
      setIp(''); setCountry(''); setCategory('Botnet'); setThreatScore(50); setNotes('');
    }
    setFormError(null);
  }, [threatToEdit, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanIp = ip.trim();
    const ipType = getIpType(cleanIp);
    if (!ipType) {
      setFormError('Introduce una dirección IPv4 o IPv6 válida.');
      return;
    }

    onSubmit({
      id: threatToEdit?.id,
      ip: cleanIp,
      ip_type: ipType,
      country: country.trim(),
      category: category || 'Botnet',
      threat_score: Number(threatScore),
      notes: notes.trim(),
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="threat-modal-title"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-xl p-6 relative shadow-2xl text-slate-100 animate-fade-up"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg hover:bg-slate-800"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <h2 id="threat-modal-title" className="text-xl font-bold font-display text-amber-400 mb-4">
          {threatToEdit ? 'Editar Amenaza' : 'Nueva Amenaza'}
        </h2>

        {formError && (
          <div role="alert" className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="threat-ip" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Dirección IP
            </label>
            <input
              id="threat-ip"
              type="text"
              required
              placeholder="Ej. 45.148.10.151"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="threat-country" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              País
            </label>
            <input
              id="threat-country"
              type="text"
              required
              placeholder="Ej. Rusia"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="threat-score" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Threat Score
              </label>
              <span className={`text-sm font-mono font-bold ${threatScore > 70 ? 'text-red-400' : 'text-amber-400'}`}>
                {threatScore}
              </span>
            </div>
            <input
              id="threat-score"
              type="range"
              min="0"
              max="100"
              value={threatScore}
              onChange={(e) => setThreatScore(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="threat-category" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Categoría
            </label>
            <select
              id="threat-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-100">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="threat-notes" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Notas SOC / Contexto Forense
            </label>
            <textarea
              id="threat-notes"
              rows={2}
              placeholder="Observaciones de telemetría..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-900 transition-colors shadow-lg shadow-amber-500/20"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
