import React from 'react';
import { Edit3, Trash2, ShieldCheck, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const getRoleBadge = (roleName) => {
  const normalized = (roleName || '').toLowerCase().trim();
  if (normalized === 'admin' || normalized === 'administrador') {
    return { name: 'Administrador', className: 'bg-hm-gold/20 text-hm-gold border-hm-gold/30' };
  }
  if (normalized === 'analyst' || normalized === 'analista' || normalized.includes('analist')) {
    return { name: 'Analista', className: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
  }
  if (normalized === 'executive' || normalized === 'directivo' || normalized.includes('directiv')) {
    return { name: 'Directivo', className: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
  }
  if (normalized === 'consultant' || normalized === 'consultor' || normalized.includes('consult')) {
    return { name: 'Consultor', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  }
  return { name: roleName || 'Usuario', className: 'bg-hm-elevated text-hm-muted border-hm-border' };
};

export default function UserTableRow({
  user: u,
  isCurrent,
  isLoading,
  onUserUpdate,
  onUserMfaReset,
  onOpenResetMfa,
  onOpenEdit,
  onOpenDelete,
}) {
  const roleBadge = getRoleBadge(u.role_name);

  const handleMfaClick = () => {
    if (onOpenResetMfa) {
      onOpenResetMfa(u);
    } else if (onUserMfaReset) {
      onUserMfaReset(u);
    }
  };

  return (
    <tr className="hover:bg-hm-elevated/40 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full bg-hm-elevated border border-hm-border flex items-center justify-center font-bold text-xs text-hm-gold shrink-0"
            aria-hidden="true"
          >
            {(u.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-mono text-hm-text block">{u.email}</span>
            {u.must_change_password && (
              <span className="text-[10px] text-yellow-400">Contraseña temporal activa</span>
            )}
          </div>
        </div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${roleBadge.className}`}>
          {roleBadge.name}
        </span>
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        <button
          type="button"
          disabled={isCurrent || isLoading}
          onClick={() => !isCurrent && onUserUpdate(u.id, { is_active: !u.is_active })}
          title={isCurrent ? 'Sesión actual (no se puede autosuspender)' : (u.is_active ? 'Suspender cuenta' : 'Activar cuenta')}
          aria-label={u.is_active ? `Suspender cuenta de ${u.email}` : `Activar cuenta de ${u.email}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-hm-gold disabled:opacity-60 disabled:cursor-not-allowed ${
            u.is_active
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20'
          }`}
        >
          {u.is_active ? <CheckCircle size={12} aria-hidden="true" /> : <XCircle size={12} aria-hidden="true" />}
          <span>{u.is_active ? 'Activo' : 'Inactivo'}</span>
        </button>
      </td>

      <td className="px-4 py-3 text-center whitespace-nowrap">
        {u.is_mfa_enabled === true ? (
          <span className="inline-flex items-center justify-center text-emerald-400" title="2FA Activado" aria-label="2FA Activado">
            <ShieldCheck size={16} aria-hidden="true" />
          </span>
        ) : (
          <span className="inline-flex items-center justify-center text-hm-muted" title="2FA Desactivado" aria-label="2FA Desactivado">
            <ShieldAlert size={16} aria-hidden="true" />
          </span>
        )}
      </td>

      <td className="px-4 py-3 text-hm-muted whitespace-nowrap">
        {u.created_at || 'Preexistente'}
      </td>

      <td className="px-4 py-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onOpenEdit(u)}
            disabled={isLoading}
            title="Modificar usuario"
            aria-label={`Modificar usuario ${u.email}`}
            className="p-1.5 text-hm-muted hover:text-hm-gold hover:bg-hm-elevated rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-gold"
          >
            <Edit3 size={15} aria-hidden="true" />
          </button>
          {u.is_mfa_enabled === true && !isCurrent && (
            <button
              type="button"
              onClick={handleMfaClick}
              disabled={isLoading}
              title="Resetear 2FA del usuario (revoca sesiones y códigos de respaldo)"
              aria-label={`Resetear 2FA para ${u.email}`}
              className="p-1.5 text-hm-muted hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <ShieldAlert size={15} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            disabled={isCurrent || isLoading}
            onClick={() => onOpenDelete(u)}
            title={isCurrent ? 'No puedes eliminar tu propia cuenta en sesión' : 'Eliminar usuario'}
            aria-label={`Eliminar usuario ${u.email}`}
            className="p-1.5 text-hm-muted hover:text-hm-danger hover:bg-hm-danger/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-danger disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}
