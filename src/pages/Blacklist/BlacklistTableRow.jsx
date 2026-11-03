import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

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
      return 'bg-slate-700/30 text-slate-300 border-slate-700/50';
  }
};

const getSeverity = (score, sev) => {
  const level = sev || (score > 85 ? 'Crítica' : score > 65 ? 'Alta' : score > 35 ? 'Media' : 'Baja');
  switch (level) {
    case 'Crítica':
      return { label: 'Crítica', cls: 'bg-red-500/10 text-red-400 border-red-500/30' };
    case 'Alta':
      return { label: 'Alta', cls: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
    case 'Media':
      return { label: 'Media', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    default:
      return { label: 'Baja', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  }
};

export default function BlacklistTableRow({ row, onEdit, onDelete, canEdit = true, canDelete = true }) {
  const score = Number(row.threat_score ?? 0);
  const severity = getSeverity(score, row.severity);

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
      <td className="p-4">
        <div className="font-mono font-medium text-slate-200">{row.ip}</div>
        <div className="text-xs text-slate-400">{row.ip_type || (row.ip?.includes(':') ? 'IPv6' : 'IPv4')}</div>
      </td>
      <td className="p-4 text-slate-200 font-medium">
        {row.country || 'Desconocido'}
      </td>
      <td className="p-4 text-slate-200 font-medium">
        <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700/60">
          {row.category || 'General'}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm font-bold w-6 text-right ${score > 70 ? 'text-red-400' : 'text-amber-400'}`}>
            {score}
          </span>
          <div
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Threat score: ${score}`}
            className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 max-w-[100px]"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${score > 70 ? 'bg-red-500' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${severity.cls}`}>
            {severity.label}
          </span>
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getStatusBadge(row.status)}`}>
          {row.status || 'En Observación'}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(row)}
            disabled={!canEdit}
            aria-label={`Editar amenaza ${row.ip}`}
            className={`p-2 rounded-lg transition-colors ${
              !canEdit ? 'opacity-30 cursor-not-allowed text-slate-600' : 'text-sky-400 hover:bg-sky-500/10 hover:text-sky-300'
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
              !canDelete ? 'opacity-30 cursor-not-allowed text-slate-600' : 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
            }`}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}
