import React from 'react';

export default function BlacklistPagination({ page, setPage, total, rowsPerPage = 5 }) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const start = total > 0 ? page * rowsPerPage + 1 : 0;
  const end = Math.min((page + 1) * rowsPerPage, total);

  return (
    <div className="p-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/20 text-sm text-slate-400">
      <div>
        Mostrando <span className="text-slate-200 font-medium">{start}</span> a{' '}
        <span className="text-slate-200 font-medium">{end}</span> de{' '}
        <span className="text-slate-200 font-medium">{total}</span> registros
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            page === 0
              ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
              : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900/60'
          }`}
        >
          Anterior
        </button>
        <span className="text-xs text-slate-500 px-1">Pág. {page + 1} de {totalPages}</span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * rowsPerPage >= total}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            (page + 1) * rowsPerPage >= total
              ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
              : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900/60'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
