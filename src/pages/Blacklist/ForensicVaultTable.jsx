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
          <thead className="bg-hm-elevated/80 border-b border-hm-border text-xs font-semibold text-hm-muted uppercase tracking-wider">
            <tr>
              <th scope="col" className="p-4">IP / TIPO</th>
              <th scope="col" className="p-4">PAÍS</th>
              <th scope="col" className="p-4">CATEGORÍA</th>
              <th scope="col" className="p-4">SCORE ORIGINAL</th>
              <th scope="col" className="p-4">FECHA ARCHIVADO</th>
              <th scope="col" className="p-4">ESTADO / NOTAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hm-border/40">
            {total === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-hm-muted text-sm">
                  No hay registros archivados en la Bóveda Forense.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const score = Number(item.threat_score ?? 0);
                return (
                  <tr key={item.id || item.ip} className="border-b border-hm-border/40 hover:bg-hm-elevated/40 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-medium text-hm-text">{item.ip}</div>
                      <div className="text-xs text-hm-muted">{item.ip_type || (item.ip?.includes(':') ? 'IPv6' : 'IPv4')}</div>
                    </td>
                    <td className="p-4 text-hm-text font-medium">{item.country || 'Desconocido'}</td>
                    <td className="p-4 text-hm-text font-medium">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-hm-elevated text-hm-text border border-hm-border">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-hm-gold w-6">
                          {score}
                        </span>
                        <div
                          role="progressbar"
                          aria-valuenow={score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Score original: ${score}`}
                          className="w-28 sm:w-32 h-1.5 bg-hm-elevated rounded-full overflow-hidden border border-hm-border"
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-hm-gold"
                            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-hm-muted">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-hm-text/90">
                        <Clock size={14} className="text-hm-gold shrink-0" />
                        <span>{item.deleted_at ? new Date(item.deleted_at).toLocaleString('es-CO') : 'Histórico'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-hm-elevated text-hm-muted border border-hm-border">
                          Archivada
                        </span>
                        {item.notes && (
                          <span className="text-xs text-hm-muted max-w-[150px] truncate" title={item.notes}>
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
