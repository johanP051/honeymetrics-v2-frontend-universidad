import React, { useState } from 'react';
import { Plus, RefreshCw, ArrowUp } from 'lucide-react';

function SpeedDialComponent({ onNewExport, onRefresh, onScrollTop }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollTop = () => {
    if (typeof onScrollTop === 'function') {
      onScrollTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const actions = [
    {
      label: '+ Nuevo Export',
      icon: Plus,
      onClick: () => {
        onNewExport?.();
        setIsOpen(false);
      },
    },
    {
      label: '🔄 Actualizar Tabla',
      icon: RefreshCw,
      onClick: () => {
        onRefresh?.();
        setIsOpen(false);
      },
    },
    {
      label: '⬆️ Subir al Inicio',
      icon: ArrowUp,
      onClick: handleScrollTop,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-none">
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5">
          {actions.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-100 border border-amber-500/40 shadow-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-label="Acciones de exportación y utilidades de logs"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        className="pointer-events-auto w-14 h-14 rounded-full bg-[#323227] hover:bg-[#584b13] text-[#EDC217] border-2 border-[#EDC217] shadow-2xl flex items-center justify-center transition-transform cursor-pointer"
      >
        <Plus
          className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export { SpeedDialComponent as BasicSpeedDial };
export default SpeedDialComponent;