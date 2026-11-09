import React, { useState, useMemo } from 'react';
import { RefreshCw, Search, FileText, X } from 'lucide-react';
import { LogsPaginationActions } from '../../pages/Logs/LogsPaginationActions';
import AuditLogRow from './AuditLogRow';

export default function AuditLogsTable({ auditLogs = [], onRefresh, isLoading }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState(null);

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return auditLogs;
    return auditLogs.filter((log) => {
      const email = String(log.actor_email || 'Sistema').toLowerCase();
      const action = String(log.action || '').toLowerCase();
      const entity = String(log.entity_name || '').toLowerCase();
      const ip = String(log.ip_address || '').toLowerCase();
      const detailsStr = typeof log.details === 'object' ? JSON.stringify(log.details).toLowerCase() : String(log.details || '').toLowerCase();
      return email.includes(q) || action.includes(q) || entity.includes(q) || ip.includes(q) || detailsStr.includes(q);
    });
  }, [auditLogs, search]);

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [filteredLogs, page, rowsPerPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-hm-border/70">
        <div>
          <h2 className="text-base font-bold text-hm-gold flex items-center gap-2">
            <FileText size={18} aria-hidden="true" />
            Tabla de Auditoría del Sistema (audit_logs)
          </h2>
          <p className="text-xs text-hm-muted mt-0.5">
            Trazabilidad inmutable de eventos de seguridad y gobernanza académica.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hm-muted" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar actor, acción, IP..."
              aria-label="Buscar en registros de auditoría"
              className="pl-8 pr-7 py-1.5 bg-hm-elevated border border-hm-border rounded-lg text-xs text-hm-text focus:outline-none focus:border-hm-gold w-full sm:w-64"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setPage(0); }}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-hm-muted hover:text-hm-text"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hm-elevated border border-hm-border text-xs font-semibold text-hm-muted hover:text-hm-gold hover:border-hm-gold/40 transition-colors disabled:opacity-50 shrink-0"
            title="Recargar registros de auditoría"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
            <span className="hidden sm:inline">Recargar</span>
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse" aria-label="Registros de auditoría del sistema">
          <thead className="bg-hm-elevated/80 text-hm-muted uppercase tracking-wider font-semibold border-b border-hm-border">
            <tr>
              <th scope="col" className="px-3.5 py-3 w-[135px]">Fecha / Hora</th>
              <th scope="col" className="px-3.5 py-3 w-[200px]">Actor</th>
              <th scope="col" className="px-3.5 py-3 w-[230px]">Acción / Entidad</th>
              <th scope="col" className="px-3.5 py-3 w-[160px]">Dirección IP</th>
              <th scope="col" className="px-3.5 py-3">Detalles Forenses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hm-border/40">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-xs text-hm-muted">
                  No se encontraron registros de auditoría coincidentes.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <AuditLogRow
                  key={log.id}
                  log={log}
                  isExpanded={expandedId === log.id}
                  onToggleExpand={() => setExpandedId(expandedId === log.id ? null : log.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <LogsPaginationActions
        count={filteredLogs.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(newRpp) => {
          setRowsPerPage(newRpp);
          setPage(0);
        }}
      />
    </div>
  );
}
