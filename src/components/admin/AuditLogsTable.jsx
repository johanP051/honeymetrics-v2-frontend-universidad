import React, { useState, useMemo } from 'react';
import { ShieldAlert, RefreshCw, Search, FileText } from 'lucide-react';

export default function AuditLogsTable({ auditLogs = [], onRefresh, isLoading }) {
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return auditLogs;
    return auditLogs.filter((log) => {
      const email = String(log.actor_email || '').toLowerCase();
      const action = String(log.action || '').toLowerCase();
      const entity = String(log.entity_name || '').toLowerCase();
      const ip = String(log.ip_address || '').toLowerCase();
      return email.includes(q) || action.includes(q) || entity.includes(q) || ip.includes(q);
    });
  }, [auditLogs, search]);

  return (
    <div className="bg-hm-card/90 border border-hm-border rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hm-border/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-hm-gold flex items-center gap-2">
            <FileText size={18} aria-hidden="true" />
            Tabla de Auditoría del Sistema (audit_logs)
          </h2>
          <p className="text-xs text-hm-muted">
            Trazabilidad inmutable de eventos de seguridad y gobernanza académica.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hm-muted" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar actor, acción, IP..."
              className="pl-8 pr-3 py-1.5 bg-hm-elevated border border-hm-border rounded-lg text-xs text-hm-text focus:outline-none focus:border-hm-gold w-48 sm:w-64"
            />
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hm-border text-xs text-hm-muted hover:text-hm-gold hover:border-hm-gold/40 transition-colors disabled:opacity-50"
            title="Recargar registros de auditoría"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
            <span className="hidden sm:inline">Recargar</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-hm-border/60">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-hm-elevated/80 text-hm-muted uppercase tracking-wider font-semibold border-b border-hm-border">
            <tr>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Fecha / Hora</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Actor</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Acción</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Entidad</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Dirección IP</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hm-border/40 font-mono">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-hm-muted font-sans">
                  No se encontraron registros de auditoría coincidentes.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-hm-elevated/40 transition-colors">
                  <td className="px-3.5 py-2.5 text-hm-muted whitespace-nowrap">
                    {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/D'}
                  </td>
                  <td className="px-3.5 py-2.5 text-hm-text font-sans font-medium whitespace-nowrap">
                    {log.actor_email || 'Sistema'}
                  </td>
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-sans font-semibold bg-hm-gold/15 text-hm-gold border border-hm-gold/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-hm-muted whitespace-nowrap">{log.entity_name}</td>
                  <td className="px-3.5 py-2.5 text-hm-info whitespace-nowrap">{log.ip_address || '127.0.0.1'}</td>
                  <td className="px-3.5 py-2.5 text-hm-muted truncate max-w-xs" title={typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '')}>
                    {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '-')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
