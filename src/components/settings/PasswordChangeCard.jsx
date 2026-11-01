import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PasswordChangeCard({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isChangingPassword,
  passwordSuccess,
  passwordError,
  strength,
  handlePasswordSubmit,
}) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="bg-hm-card/90 border border-hm-border rounded-xl p-5 sm:p-6 shadow-lg">
      <div className="flex items-center gap-3 border-b border-hm-border/60 pb-4 mb-5">
        <div className="w-10 h-10 rounded-lg bg-hm-gold/15 border border-hm-gold/30 flex items-center justify-center text-hm-gold shrink-0">
          <KeyRound size={20} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-bold text-hm-text">Actualizar Contraseña</h2>
          <p className="text-xs text-hm-muted">
            La nueva contraseña debe tener al menos 12 caracteres (OWASP ASVS V2.1).
          </p>
        </div>
      </div>

      {passwordSuccess && (
        <div role="status" aria-live="polite" className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{passwordSuccess}</span>
        </div>
      )}

      {passwordError && (
        <div role="alert" className="mb-4 p-3 rounded-lg bg-hm-danger/10 border border-hm-danger/30 text-hm-danger text-xs font-medium flex items-center gap-2">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{passwordError}</span>
        </div>
      )}

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label htmlFor="current-pwd-input" className="block text-xs font-semibold text-hm-muted mb-1">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              id="current-pwd-input"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 bg-hm-elevated border border-hm-border rounded-lg text-sm text-hm-text focus:outline-none focus:border-hm-gold"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? 'Ocultar contraseña' : 'Ver contraseña'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-hm-muted hover:text-hm-gold p-1"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="new-pwd-input" className="block text-xs font-semibold text-hm-muted mb-1">
            Nueva Contraseña (mínimo 12 caracteres)
          </label>
          <div className="relative">
            <input
              id="new-pwd-input"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 bg-hm-elevated border border-hm-border rounded-lg text-sm text-hm-text focus:outline-none focus:border-hm-gold"
              required
              minLength={12}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? 'Ocultar contraseña' : 'Ver contraseña'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-hm-muted hover:text-hm-gold p-1"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {newPassword && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-hm-muted">
                <span>Fuerza:</span>
                <span className="font-semibold text-hm-text">{strength.label}</span>
              </div>
              <div className="w-full h-1.5 bg-hm-elevated rounded-full overflow-hidden border border-hm-border/40">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirm-pwd-input" className="block text-xs font-semibold text-hm-muted mb-1">
            Confirmar Nueva Contraseña
          </label>
          <input
            id="confirm-pwd-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-sm text-hm-text focus:outline-none focus:border-hm-gold"
            required
            minLength={12}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-hm-gold text-slate-950 text-xs font-bold hover:bg-hm-goldHover transition-colors disabled:opacity-50"
          >
            <Lock size={14} aria-hidden="true" />
            <span>{isChangingPassword ? 'Actualizando...' : 'Guardar Nueva Contraseña'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
