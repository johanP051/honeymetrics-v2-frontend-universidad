import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function MfaModal({ isOpen, onClose, qrCode, secret, onVerify, isLoading }) {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setError('El código debe contener exactamente 6 dígitos.');
      return;
    }
    setError('');
    const success = await onVerify(code.trim());
    if (success) {
      setCode('');
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden p-4">
      <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative border border-hm-border shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-hm-muted hover:text-hm-danger transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-display font-bold text-hm-gold mb-2 flex items-center gap-2">
          <ShieldCheck size={22} />
          Configurar 2FA (Google Authenticator)
        </h2>
        <p className="text-xs text-hm-muted mb-4">
          Escanea el código QR con tu aplicación de autenticación (Google Authenticator, Authy o 1Password).
        </p>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl mb-4">
          {qrCode ? (
            <img src={qrCode} alt="QR 2FA HoneyMetrics" className="w-48 h-48 object-contain" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-800 text-xs">
              Generando QR...
            </div>
          )}
        </div>

        {/* Manual Key */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-hm-muted uppercase tracking-wider mb-1">
            Clave secreta manual
          </label>
          <div className="flex items-center gap-2 bg-hm-bg p-2 rounded-lg border border-hm-border">
            <span className="font-mono text-xs text-hm-gold flex-1 truncate select-all">{secret}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 text-hm-muted hover:text-hm-gold hover:bg-hm-elevated rounded transition-colors"
              title="Copiar clave"
            >
              {copied ? <Check size={16} className="text-hm-success" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-hm-muted uppercase tracking-wider mb-1">
              Código de verificación (6 dígitos)
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
              className="w-full bg-hm-bg border border-hm-border rounded-lg px-3 py-2 text-center text-lg font-mono tracking-widest text-hm-gold focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm text-hm-muted hover:bg-hm-elevated hover:text-hm-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="flex items-center gap-2 px-4 py-2 bg-hm-gold text-hm-bg font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] text-sm disabled:opacity-50"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>{isLoading ? 'Verificando...' : 'Activar 2FA'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
