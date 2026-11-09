import React from 'react';
import { Edit2, Trash2, Lock } from 'lucide-react';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Bloqueada':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'En Observación':
    case 'Monitoreada':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Mitigada':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    default:
      return 'bg-hm-elevated text-hm-muted border-hm-border';
  }
};

export default function BlacklistTableRow({ row, onEdit, onDelete, canEdit = true, canDelete = true }) {
  const score = Number(row.threat_score ?? 0);

  return (
    <tr className="border-b border-hm-border/40 hover:bg-hm-elevated/40 transition-colors">
      <td className="p-4">
        <div className="font-mono font-medium text-hm-text">{row.ip}</div>
        <div className="text-xs text-hm-muted">{row.ip_type || (row.ip?.includes(':') ? 'IPv6' : 'IPv4')}</div>
      </td>
      <td className="p-4 text-hm-text font-medium">
        {row.country || 'Desconocido'}
      </td>
      <td className="p-4 text-hm-text font-medium">
        <span className="px-2 py-0.5 rounded text-xs font-mono bg-hm-elevated text-hm-text border border-hm-border">
          {row.category || 'General'}
        </span>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getStatusBadge(row.status)}`}>
          {row.status || 'En Observación'}
        </span>
      </td>
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-hm-gold w-6">{score}</span>
          <div
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Threat score: ${score}`}
            className="w-28 sm:w-32 h-1.5 bg-hm-elevated rounded-full overflow-hidden border border-hm-border"
          >
            <div
              className="h-full rounded-full transition-all duration-500 bg-hm-gold"
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
        </div>
      </td>
      <td className="p-4 text-right">
        {!canEdit && !canDelete ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-hm-elevated text-hm-muted border border-hm-border">
            <Lock size={12} aria-hidden="true" />
            <span>Solo lectura</span>
          </span>
        ) : (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onEdit(row)}
              disabled={!canEdit}
              aria-label={`Editar amenaza ${row.ip}`}
              className={`p-2 rounded-lg transition-colors ${
                !canEdit ? 'opacity-30 cursor-not-allowed text-hm-muted' : 'text-sky-400 hover:bg-sky-500/10 hover:text-sky-300'
              }`}
            >
              <Edit2 size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(row.id)}
              disabled={!canDelete}
              aria-label={`Purgar amenaza ${row.ip}`}
              className={`p-2 rounded-lg transition-colors ${
                !canDelete ? 'opacity-30 cursor-not-allowed text-hm-muted' : 'text-hm-danger hover:bg-hm-danger/10 hover:text-red-300'
              }`}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
