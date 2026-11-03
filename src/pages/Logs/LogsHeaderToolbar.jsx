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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <FileText className="text-blue-400 w-7 h-7" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">
            Logs & Reportes
          </h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Historial de exportaciones, reportes forenses y descargas de telemetría cruda.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={onBuscar} className="relative flex-1 sm:w-64" role="search" aria-label="Búsqueda de exportaciones">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="buscar-registros"
            type="search"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por ID o fecha..."
            aria-label="Buscar exportaciones por ID o fecha"
            className="w-full bg-slate-900/60 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-8 py-2 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {busqueda && (
            <button
              type="button"
              onClick={onLimpiar}
              aria-label="Limpiar campo de búsqueda"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors border ${
              menuFiltrosAbierto
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'text-slate-300 bg-slate-900/60 border-slate-700 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <Filter className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>Filtro</span>
            {estadosSeleccionados.length < estados.length && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {menuFiltrosAbierto && (
            <div
              ref={menuRef}
              id="filtro-estados-menu"
              role="region"
              aria-label="Opciones de filtro por estado"
              className="absolute right-0 mt-2 w-52 p-3 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-30 space-y-2 backdrop-blur-md"
            >
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                Filtrar por estado
              </p>
              <div className="space-y-1.5 pt-1">
                {estados.map((estado) => {
                  const seleccionado = estadosSeleccionados.includes(estado);
                  return (
                    <label key={estado} className="flex items-center gap-2 text-xs text-slate-300 hover:text-slate-100 cursor-pointer p-1 rounded hover:bg-slate-800/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() => onAlternarEstado(estado)}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
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
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>+ Nuevo Export</span>
        </button>
      </div>
    </div>
  );
}
