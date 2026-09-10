import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-hm-border bg-hm-bg/80 backdrop-blur-sm z-10 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-hm-muted">
          HoneyMetrics © {new Date().getFullYear()}. Todos los derechos reservados.
        </p>
        <span className="inline-block px-2 py-1 text-xs font-mono font-medium rounded-full bg-hm-gold/10 text-hm-gold border border-hm-gold/20 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
          Versión 1.0.0
        </span>
      </div>
    </footer>
  );
}
