import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-5 mt-auto border-t border-hm-border/70 bg-hm-bg/90 backdrop-blur-sm z-10 text-center">
      <div className="flex flex-col items-center justify-center gap-1.5 px-4">
        <p className="text-xs text-hm-muted">
          HoneyMetrics © {new Date().getFullYear()}. Todos los derechos reservados — UDEC Facatativá.
        </p>
        <span className="inline-block px-2.5 py-0.5 text-[11px] font-mono font-medium rounded-full bg-hm-gold/10 text-hm-gold border border-hm-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.08)]">
          Versión 2.4.4
        </span>
      </div>
    </footer>
  );
}
