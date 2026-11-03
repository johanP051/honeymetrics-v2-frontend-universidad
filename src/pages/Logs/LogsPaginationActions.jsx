import React from 'react';
import PropTypes from 'prop-types';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export function LogsPaginationActions({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-700/60 bg-slate-800/40 text-xs sm:text-sm text-slate-400">
      <div className="flex items-center gap-2">
        <span>Filas por página:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          aria-label="Filas por página"
          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-500 transition-colors"
        >
          {[5, 10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-slate-300 font-mono">
          {from}–{to} de {count}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(0)}
            disabled={page === 0}
            aria-label="Primera página"
            className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            aria-label="Página anterior"
            className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            aria-label="Página siguiente"
            className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={page >= totalPages - 1}
            aria-label="Última página"
            className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

LogsPaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export function SortableHeader({ etiqueta, columna, align = 'left', orden, onOrdenar }) {
  const activa = orden.columna === columna;
  const descendente = activa && orden.direccion === 'desc';
  const alignClass = align === 'right' ? 'text-right justify-end' : align === 'center' ? 'text-center justify-center' : 'text-left justify-start';

  return (
    <th
      scope="col"
      className={`p-4 text-xs font-semibold uppercase tracking-wider ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
      aria-sort={activa ? (descendente ? 'descending' : 'ascending') : 'none'}
    >
      <button
        type="button"
        onClick={() => onOrdenar(columna)}
        className={`inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors ${alignClass} ${activa ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        aria-label={`Ordenar por ${etiqueta}`}
      >
        <span>{etiqueta}</span>
        {activa ? (
          descendente ? <ArrowDown className="w-3.5 h-3.5 text-amber-400" /> : <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
        )}
      </button>
    </th>
  );
}

export const MESES_MAP = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

export function parseFechaSolicitud(fechaStr) {
  if (!fechaStr) return 0;
  const isoTime = new Date(fechaStr).getTime();
  if (!Number.isNaN(isoTime)) return isoTime;

  const regex = /(\d{1,2})\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚ]+)\s+de\s+(\d{4}),?\s+(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?)?/i;
  const match = String(fechaStr).toLowerCase().match(regex);
  if (!match) return 0;

  const dia = Number.parseInt(match[1], 10);
  const mesNombre = match[2];
  const anio = Number.parseInt(match[3], 10);
  let hora = Number.parseInt(match[4], 10);
  const minuto = Number.parseInt(match[5], 10);
  const ampm = match[6];

  const mes = MESES_MAP[mesNombre] ?? -1;
  if (mes === -1) return 0;

  if (ampm) {
    const esPM = ampm.startsWith('p');
    if (esPM && hora < 12) hora += 12;
    if (!esPM && hora === 12) hora = 0;
  }
  return new Date(anio, mes, dia, hora, minuto).getTime();
}

export default LogsPaginationActions;
