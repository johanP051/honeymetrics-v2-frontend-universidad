import React, { useEffect, useRef } from 'react';
import { FileText, Plus, Search, Filter, X } from 'lucide-react';

export default function LogsHeaderToolbar({
  onOpenExportModal,
  busqueda,
  onBusquedaChange,
  onBuscar,
  menuFiltrosAbierto,
  estados = [],
  estadosSeleccionados = [],
  onAlternarFiltro,
  onCerrarFiltro,
  onAlternarEstado,
  onLimpiar,
  filterButtonRef,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuFiltrosAbierto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrarFiltro();
        filterButtonRef?.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        filterButtonRef?.current &&
        !filterButtonRef.current.contains(e.target)
      ) {
        onCerrarFiltro();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuFiltrosAbierto, onCerrarFiltro, filterButtonRef]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-hm-border/70 pb-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-hm-gold flex items-center gap-2.5">
          <FileText size={28} aria-hidden="true" />
          Logs & Reportes
        </h1>
        <p className="text-hm-muted text-xs sm:text-sm mt-1">
          Historial de exportaciones, reportes forenses y descargas de telemetría cruda.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <form onSubmit={onBuscar} className="relative flex-1 sm:w-64" role="search" aria-label="Búsqueda de exportaciones">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-hm-muted" aria-hidden="true" />
          <input
            id="buscar-registros"
            type="search"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por ID o fecha..."
            aria-label="Buscar exportaciones por ID o fecha"
            className="w-full bg-hm-elevated border border-hm-border text-hm-text text-xs sm:text-sm rounded-lg pl-9 pr-8 py-2 placeholder-hm-muted focus:outline-none focus:border-hm-gold transition-colors"
          />
          {busqueda && (
            <button
              type="button"
              onClick={onLimpiar}
              aria-label="Limpiar campo de búsqueda"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-hm-muted hover:text-hm-text p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </form>

        <div className="relative">
          <button
            ref={filterButtonRef}
            type="button"
            onClick={onAlternarFiltro}
            aria-expanded={menuFiltrosAbierto}
            aria-controls="filtro-estados-menu"
            aria-haspopup="true"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors border ${
              menuFiltrosAbierto
                ? 'bg-hm-gold/15 text-hm-gold border-hm-gold/30'
                : 'text-hm-text bg-hm-elevated border-hm-border hover:border-hm-gold/40'
            }`}
          >
            <Filter className="w-4 h-4 text-hm-muted" aria-hidden="true" />
            <span>Filtro</span>
            {estadosSeleccionados.length < estados.length && (
              <span className="w-2 h-2 rounded-full bg-hm-gold" />
            )}
          </button>

          {menuFiltrosAbierto && (
            <div
              ref={menuRef}
              id="filtro-estados-menu"
              role="region"
              aria-label="Opciones de filtro por estado"
              className="absolute right-0 mt-2 w-52 p-3 bg-hm-card border border-hm-border rounded-xl shadow-2xl z-30 space-y-2 backdrop-blur-md"
            >
              <p className="text-xs font-semibold text-hm-muted uppercase tracking-wider pb-1 border-b border-hm-border">
                Filtrar por estado
              </p>
              <div className="space-y-1.5 pt-1">
                {estados.map((estado) => {
                  const seleccionado = estadosSeleccionados.includes(estado);
                  return (
                    <label key={estado} className="flex items-center gap-2 text-xs text-hm-text hover:text-hm-gold cursor-pointer p-1 rounded hover:bg-hm-elevated transition-colors">
                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() => onAlternarEstado(estado)}
                        className="rounded border-hm-border bg-hm-elevated text-hm-gold focus:ring-hm-gold focus:ring-offset-0"
                      />
                      <span>{estado}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="bg-hm-gold hover:bg-hm-goldHover text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-hm-gold/15 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Nuevo Export</span>
        </button>
      </div>
    </div>
  );
}
