import React from 'react';

export default function BlacklistPagination({ page, setPage, total, rowsPerPage = 5 }) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const start = total > 0 ? page * rowsPerPage + 1 : 0;
  const end = Math.min((page + 1) * rowsPerPage, total);

  return (
    <div className="px-4 py-3.5 border-t border-hm-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 bg-hm-elevated/40 text-xs sm:text-sm text-hm-muted">
      <div>
        Mostrando <span className="text-hm-text font-mono font-medium">{start}</span> a{' '}
        <span className="text-hm-text font-mono font-medium">{end}</span> de{' '}
        <span className="text-hm-text font-mono font-medium">{total}</span> registros
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1.5 rounded-lg border border-hm-border bg-hm-card text-xs font-semibold text-hm-text hover:text-hm-gold hover:border-hm-gold/40 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        <span className="text-xs font-mono text-hm-muted px-1">Pág. {page + 1} de {totalPages}</span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * rowsPerPage >= total}
          className="px-3 py-1.5 rounded-lg border border-hm-border bg-hm-card text-xs font-semibold text-hm-text hover:text-hm-gold hover:border-hm-gold/40 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
