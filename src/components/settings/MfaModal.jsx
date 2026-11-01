import React, { useState } from 'react';
import { X, Smartphone, AlertCircle } from 'lucide-react';
import { useModalA11y } from '../../hooks/useModalA11y';
import MfaBackupCodesView from './MfaBackupCodesView';

export default function MfaModal({
  isOpen,
  onClose,
  triggerRef,
  mfaData,
  onVerify,
  isLoading,
  mfaMessage,
}) {
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('setup'); // 'setup' | 'codes'
  const [backupCodes, setBackupCodes] = useState([]);
  const [errorLocal, setErrorLocal] = useState('');

  const modalRef = useModalA11y({
    isOpen,
    onClose: () => handleClose(step === 'codes'),
    triggerRef,
    isLoading,
  });

  if (!isOpen) return null;

  const handleClose = (wasActivated = false) => {
    setOtpCode('');
    setStep('setup');
    setBackupCodes([]);
    setErrorLocal('');
    onClose(wasActivated);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErrorLocal('');
    if (otpCode.length !== 6) {
      setErrorLocal('El código debe contener exactamente 6 dígitos.');
      return;
    }
    const result = await onVerify(otpCode);
    if (result && result.success) {
      setBackupCodes(result.backup_codes || []);
      setStep('codes');
    }
  };

  const qrSrc = mfaData?.qr?.startsWith('data:')
    ? mfaData.qr
    : (mfaData?.qr ? `data:image/png;base64,${mfaData.qr}` : (mfaData?.qr_code_base64 ? `data:image/png;base64,${mfaData.qr_code_base64}` : ''));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mfa-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-hm-card border border-hm-border rounded-xl shadow-2xl p-5 sm:p-6 text-hm-text"
      >
        <div className="flex items-center justify-between border-b border-hm-border/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Smartphone size={20} className="text-hm-gold" aria-hidden="true" />
            <h2 id="mfa-modal-title" className="text-base font-bold text-hm-text">
              {step === 'setup' ? 'Vincular Autenticación 2FA' : 'Códigos de Respaldo'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleClose(step === 'codes')}
            disabled={isLoading}
            aria-label="Cerrar modal"
            className="p-1 rounded-lg text-hm-muted hover:text-hm-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {step === 'codes' ? (
          <MfaBackupCodesView
            backupCodes={backupCodes}
            onFinish={() => handleClose(true)}
          />
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <p className="text-xs text-hm-muted">
              Escanee el código QR con su aplicación autenticadora (Google Authenticator, Aegis o Authy) o ingrese la clave manual.
            </p>

            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-hm-border">
              {qrSrc ? (
                <img
                  src={qrSrc}
                  alt="Código QR de vinculación MFA"
                  className="w-44 h-44 object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-500 font-mono">
                  Generando QR...
                </div>
              )}
            </div>

            {mfaData?.secret && (
              <div className="p-2.5 bg-hm-elevated border border-hm-border rounded-lg text-center">
                <span className="block text-[11px] text-hm-muted mb-0.5">Clave secreta Base32:</span>
                <code className="text-xs font-mono font-bold text-hm-gold tracking-widest select-all">
                  {mfaData.secret}
                </code>
              </div>
            )}

            {(errorLocal || mfaMessage) && (
              <div role="alert" className="p-2.5 rounded-lg bg-hm-danger/10 border border-hm-danger/30 text-hm-danger text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorLocal || mfaMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor="totp-code-input" className="block text-xs font-semibold text-hm-muted mb-1">
                Código de 6 dígitos
              </label>
              <input
                id="totp-code-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-widest font-mono text-base px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-hm-text focus:outline-none focus:border-hm-gold"
                autoComplete="one-time-code"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleClose(false)}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-lg border border-hm-border text-xs text-hm-muted hover:text-hm-text"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="px-4 py-1.5 rounded-lg bg-hm-gold text-slate-950 text-xs font-bold hover:bg-hm-goldHover transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verificando...' : 'Verificar y Activar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
