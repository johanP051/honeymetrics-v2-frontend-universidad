import React, { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import BlacklistPagination from './BlacklistPagination';

export default function ForensicVaultTable({ vaultData = [], searchTerm = '' }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const filteredVault = useMemo(() => {
    const term = searchTerm?.trim()?.toLowerCase();
    if (!term) return vaultData;
    return vaultData.filter((t) =>
      [t.ip, t.country, t.category, t.notes].some((v) =>
        String(v || '').toLowerCase().includes(term)
      )
    );
  }, [vaultData, searchTerm]);

  const paginatedData = useMemo(() => {
    return filteredVault.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [filteredVault, page, rowsPerPage]);

  const total = filteredVault.length;

  return (
    <div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse" aria-label="Bóveda Forense de Amenazas">
          <thead className="bg-slate-900/70 border-b border-slate-700/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th scope="col" className="p-4">IP / TIPO</th>
              <th scope="col" className="p-4">PAÍS</th>
              <th scope="col" className="p-4">CATEGORÍA</th>
              <th scope="col" className="p-4">SCORE ORIGINAL</th>
              <th scope="col" className="p-4">FECHA ARCHIVADO</th>
              <th scope="col" className="p-4">ESTADO / NOTAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {total === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                  No hay registros archivados en la Bóveda Forense.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const score = Number(item.threat_score ?? 0);
                return (
                  <tr key={item.id || item.ip} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-medium text-slate-200">{item.ip}</div>
                      <div className="text-xs text-slate-400">{item.ip_type || (item.ip?.includes(':') ? 'IPv6' : 'IPv4')}</div>
                    </td>
                    <td className="p-4 text-slate-200 font-medium">{item.country || 'Desconocido'}</td>
                    <td className="p-4 text-slate-200 font-medium">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700/60">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-amber-400 w-6">
                          {score}
                        </span>
                        <div
                          role="progressbar"
                          aria-valuenow={score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Score original: ${score}`}
                          className="w-28 sm:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60"
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-amber-400"
                            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                        <Clock size={14} className="text-amber-500 shrink-0" />
                        <span>{item.deleted_at ? new Date(item.deleted_at).toLocaleString('es-CO') : 'Histórico'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700/40 text-slate-300 border border-slate-600/40">
                          Archivada
                        </span>
                        {item.notes && (
                          <span className="text-xs text-slate-400 max-w-[150px] truncate" title={item.notes}>
                            {item.notes}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <BlacklistPagination page={page} setPage={setPage} total={total} rowsPerPage={rowsPerPage} />
    </div>
  );
}
