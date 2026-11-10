import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function getActionBadgeStyle(action = '') {
  const upper = String(action).toUpperCase();
  if (upper.includes('DELETED') || upper.includes('REVOKED') || upper.includes('FAILED') || upper.includes('BLOCKED')) {
    return 'bg-hm-danger/15 text-hm-danger border-hm-danger/30';
  }
  if (upper.includes('CREATED') || upper.includes('ENABLED') || upper.includes('SUCCESS') || upper.includes('RESTORED')) {
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  }
  if (upper.includes('ARCHIVED') || upper.includes('VAULT') || upper.includes('RESET')) {
    return 'bg-hm-info/15 text-hm-info border-hm-info/30';
  }
  return 'bg-hm-gold/15 text-hm-gold border-hm-gold/30';
}

export function parseDetailsObject(details) {
  if (!details) return null;
  if (typeof details === 'object') return details;
  try {
    return JSON.parse(details);
  } catch {
    return null;
  }
}

export function formatAuditTimestamp(createdAt) {
  if (!createdAt) return { date: 'N/D', time: '' };
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return { date: String(createdAt), time: '' };
  return {
    date: d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    time: d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

export default function AuditLogRow({ log, isExpanded, onToggleExpand }) {
  const { date, time } = formatAuditTimestamp(log.created_at);
  const parsedDetails = parseDetailsObject(log.details);
  const entries = parsedDetails ? Object.entries(parsedDetails) : [];

  return (
    <tr className="hover:bg-hm-elevated/40 transition-colors align-top">
      <td className="px-3.5 py-3 font-mono whitespace-nowrap">
        <span className="block text-hm-text font-medium">{date}</span>
        {time && <span className="block text-[11px] text-hm-muted">{time}</span>}
      </td>
      <td className="px-3.5 py-3">
        <span
          className="text-hm-text font-medium block max-w-[190px] truncate"
          title={log.actor_email || 'Sistema'}
        >
          {log.actor_email || 'Sistema'}
        </span>
      </td>
      <td className="px-3.5 py-3">
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getActionBadgeStyle(log.action)}`}>
          {log.action}
        </span>
        <span className="block text-[11px] font-mono text-hm-muted mt-1">
          Entidad: <strong className="text-hm-text/80 font-normal">{log.entity_name || 'sistema'}</strong>
        </span>
      </td>
      <td className="px-3.5 py-3 font-mono">
        <span
          className="text-hm-info block max-w-[155px] truncate"
          title={log.ip_address || '127.0.0.1'}
        >
          {log.ip_address || '127.0.0.1'}
        </span>
      </td>
      <td className="px-3.5 py-3 font-mono">
        {entries.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {(isExpanded ? entries : entries.slice(0, 2)).map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-hm-elevated border border-hm-border/80 text-[11px] text-hm-muted max-w-[240px] truncate"
                title={`${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`}
              >
                <span className="text-hm-gold/90 font-semibold">{k}:</span>
                <span className="text-hm-text truncate">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
              </span>
            ))}
            {entries.length > 2 && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold text-hm-gold hover:bg-hm-gold/10 transition-colors"
              >
                {isExpanded ? (
                  <>Menos <ChevronUp size={11} /></>
                ) : (
                  <>+{entries.length - 2} más <ChevronDown size={11} /></>
                )}
              </button>
            )}
          </div>
        ) : (
          <span className="text-hm-muted">{String(log.details || '—')}</span>
        )}
      </td>
    </tr>
  );
}
