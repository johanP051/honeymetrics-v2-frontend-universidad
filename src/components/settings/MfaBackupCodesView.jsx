import React, { useState } from 'react';
import { Copy, Download, Check, ShieldCheck } from 'lucide-react';

export default function MfaBackupCodesView({ backupCodes = [], onFinish }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback si clipboard falla
    }
  };

  const handleDownload = () => {
    const content = `HoneyMetrics CTI - Códigos de Respaldo 2FA\nFecha: ${new Date().toISOString()}\n\n` +
      backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n') +
      '\n\nGuarde estos códigos en un lugar seguro y confidencial. Cada código solo puede usarse una vez.\n';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `honeymetrics-backup-codes-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
        <span className="font-bold flex items-center gap-1.5 mb-1">
          <ShieldCheck size={16} aria-hidden="true" />
          ¡Autenticación en Dos Pasos Activada con Éxito!
        </span>
        Guarde estos 8 códigos de respaldo en un lugar seguro. Si pierde acceso a su app autenticadora, le permitirán recuperar el acceso a su cuenta.
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 bg-hm-elevated border border-hm-border rounded-lg font-mono text-center text-xs sm:text-sm font-bold text-hm-gold">
        {backupCodes.map((code, idx) => (
          <div key={idx} className="p-2 bg-hm-card/80 border border-hm-border/40 rounded">
            {code}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-hm-border/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hm-border text-xs text-hm-muted hover:text-hm-gold hover:border-hm-gold/40 transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copiados' : 'Copiar'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hm-border text-xs text-hm-muted hover:text-hm-gold hover:border-hm-gold/40 transition-colors"
          >
            <Download size={14} />
            <span>Descargar .txt</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="px-4 py-1.5 rounded-lg bg-hm-gold text-slate-950 text-xs font-bold hover:bg-hm-goldHover transition-colors"
        >
          He guardado mis códigos (Finalizar)
        </button>
      </div>
    </div>
  );
}
