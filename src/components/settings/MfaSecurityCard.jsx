import React from 'react';
import { ShieldCheck, ShieldAlert, Smartphone, ArrowRight, ShieldX } from 'lucide-react';

export default function MfaSecurityCard({
  isMfaEnabled,
  onOpenSetup,
  onOpenDisable,
  mfaTriggerRef,
  disableMfaTriggerRef,
  isLoading,
}) {
  return (
    <div className="bg-hm-card/90 border border-hm-border rounded-xl p-5 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hm-border/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-hm-gold/15 border border-hm-gold/30 flex items-center justify-center text-hm-gold shrink-0">
            <Smartphone size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-hm-text">Autenticación en Dos Pasos (2FA)</h2>
            <p className="text-xs text-hm-muted">
              Protección criptográfica mediante códigos temporales TOTP (Google Authenticator / Aegis).
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {isMfaEnabled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <ShieldCheck size={14} aria-hidden="true" />
              Activado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-hm-warning/15 border border-hm-warning/30 text-hm-warning">
              <ShieldAlert size={14} aria-hidden="true" />
              Desactivado
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="text-xs text-hm-muted leading-relaxed max-w-xl">
          {isMfaEnabled
            ? 'Su cuenta requiere un código OTP de 6 dígitos o un código de respaldo para cada inicio de sesión.'
            : 'Se recomienda activar 2FA para proteger las sesiones administrativas contra accesos no autorizados.'}
        </div>

        <div className="shrink-0">
          {isMfaEnabled ? (
            <button
              ref={disableMfaTriggerRef}
              type="button"
              onClick={onOpenDisable}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-hm-danger/40 text-hm-danger hover:bg-hm-danger/10 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <ShieldX size={15} aria-hidden="true" />
              <span>Desactivar 2FA</span>
            </button>
          ) : (
            <button
              ref={mfaTriggerRef}
              type="button"
              onClick={onOpenSetup}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-hm-gold text-slate-950 text-xs font-bold hover:bg-hm-goldHover transition-colors disabled:opacity-50"
            >
              <ShieldCheck size={15} aria-hidden="true" />
              <span>{isLoading ? 'Iniciando...' : 'Activar 2FA'}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
