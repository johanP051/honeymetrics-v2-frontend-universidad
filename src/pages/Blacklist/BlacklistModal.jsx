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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="threat-modal-title"
        className="w-full max-w-lg bg-hm-card border border-hm-border rounded-xl p-6 relative shadow-2xl text-hm-text animate-fade-up"
      >
        <div className="flex items-center justify-between border-b border-hm-border/60 pb-3 mb-4">
          <h2 id="threat-modal-title" className="text-xl font-bold font-display text-hm-gold">
            {threatToEdit ? 'Editar Amenaza' : 'Nueva Amenaza'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-hm-muted hover:text-hm-text transition-colors p-1 rounded-lg hover:bg-hm-elevated"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {formError && (
          <div role="alert" className="mb-4 bg-hm-danger/10 border border-hm-danger/30 text-hm-danger p-3 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="threat-ip" className="block text-xs font-semibold uppercase tracking-wider text-hm-muted mb-1">
              Dirección IP
            </label>
            <input
              id="threat-ip"
              type="text"
              required
              placeholder="Ej. 45.148.10.151"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full bg-hm-elevated border border-hm-border rounded-lg px-3 py-2 text-hm-text text-sm font-mono placeholder-hm-muted/60 focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          <div>
            <label htmlFor="threat-country" className="block text-xs font-semibold uppercase tracking-wider text-hm-muted mb-1">
              País
            </label>
            <input
              id="threat-country"
              type="text"
              required
              placeholder="Ej. Rusia"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-hm-elevated border border-hm-border rounded-lg px-3 py-2 text-hm-text text-sm placeholder-hm-muted/60 focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="threat-score" className="text-xs font-semibold uppercase tracking-wider text-hm-muted">
                Threat Score
              </label>
              <span className={`text-sm font-mono font-bold ${threatScore > 70 ? 'text-hm-danger' : 'text-hm-gold'}`}>
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
              className="w-full accent-hm-gold cursor-pointer h-2 bg-hm-elevated border border-hm-border/60 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="threat-category" className="block text-xs font-semibold uppercase tracking-wider text-hm-muted mb-1">
              Categoría
            </label>
            <select
              id="threat-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-hm-elevated border border-hm-border rounded-lg px-3 py-2 text-hm-text text-sm focus:outline-none focus:border-hm-gold transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-hm-card text-hm-text">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="threat-notes" className="block text-xs font-semibold uppercase tracking-wider text-hm-muted mb-1">
              Notas SOC / Contexto Forense
            </label>
            <textarea
              id="threat-notes"
              rows={2}
              placeholder="Observaciones de telemetría..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-hm-elevated border border-hm-border rounded-lg px-3 py-2 text-hm-text text-sm placeholder-hm-muted/60 focus:outline-none focus:border-hm-gold transition-colors resize-none"
            />
          </div>

          <div className="pt-3 border-t border-hm-border/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-hm-border text-hm-muted hover:text-hm-text hover:bg-hm-elevated transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-bold bg-hm-gold hover:bg-hm-goldHover text-slate-950 transition-colors shadow-lg shadow-hm-gold/20"
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
