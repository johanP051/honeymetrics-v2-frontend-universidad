import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { useModalA11y } from '../../hooks/useModalA11y';

export default function ResetMfaModal({
  isOpen,
  onClose,
  userToReset,
  onConfirm,
  isLoading,
  triggerRef,
}) {
  const modalRef = useModalA11y({ isOpen, onClose, triggerRef, isLoading });

  if (!isOpen || !userToReset) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-mfa-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-hm-card border border-hm-border rounded-xl shadow-2xl p-5 sm:p-6 text-hm-text"
      >
        <div className="flex items-center justify-between border-b border-hm-border/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-400" aria-hidden="true" />
            <h2 id="reset-mfa-modal-title" className="text-base font-bold text-hm-text">
              Restablecer Autenticación 2FA
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cerrar diálogo"
            className="p-1 rounded-lg text-hm-muted hover:text-hm-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-hm-muted leading-relaxed">
            ¿Estás seguro de restablecer el 2FA para el usuario{' '}
            <strong className="text-hm-text font-mono">{userToReset.email}</strong>? Se revocarán todas sus sesiones activas y códigos de respaldo.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-hm-border/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-lg border border-hm-border text-hm-muted hover:text-hm-text"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Restableciendo...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
