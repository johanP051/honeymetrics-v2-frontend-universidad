import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useModalA11y } from '../../hooks/useModalA11y';

export default function DisableMfaModal({
  isOpen,
  onClose,
  triggerRef,
  onDisable,
  isLoading,
  mfaMessage,
}) {
  const [password, setPassword] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  const modalRef = useModalA11y({
    isOpen,
    onClose,
    triggerRef,
    isLoading,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal('');
    if (!password) {
      setErrorLocal('Ingrese su contraseña actual.');
      return;
    }
    const success = await onDisable(password);
    if (success) {
      setPassword('');
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disable-mfa-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-hm-card border border-hm-border rounded-xl shadow-2xl p-5 sm:p-6 text-hm-text"
      >
        <div className="flex items-center justify-between border-b border-hm-border/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-hm-danger" aria-hidden="true" />
            <h2 id="disable-mfa-title" className="text-base font-bold text-hm-text">
              Desactivar Autenticación 2FA
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cerrar diálogo"
            className="p-1 rounded-lg text-hm-muted hover:text-hm-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-lg bg-hm-danger/10 border border-hm-danger/30 text-hm-danger text-xs flex items-start gap-2.5">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Advertencia de Seguridad</p>
              <p>
                Al desactivar 2FA, su cuenta perderá la protección de segundo factor y todos sus códigos de respaldo serán revocados inmediatamente.
              </p>
            </div>
          </div>

          {(errorLocal || mfaMessage) && (
            <div role="alert" className="p-2.5 rounded-lg bg-hm-danger/10 border border-hm-danger/30 text-hm-danger text-xs">
              {errorLocal || mfaMessage}
            </div>
          )}

          <div>
            <label htmlFor="disable-mfa-pwd" className="block text-xs font-semibold text-hm-muted mb-1">
              Contraseña Actual para Confirmar
            </label>
            <input
              id="disable-mfa-pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-sm text-hm-text focus:outline-none focus:border-hm-danger"
              placeholder="Digite su contraseña"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-lg border border-hm-border text-xs text-hm-muted hover:text-hm-text"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="px-4 py-1.5 rounded-lg bg-hm-danger text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Desactivando...' : 'Confirmar Desactivación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
