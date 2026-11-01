import React, { useState, useMemo, useRef } from 'react';
import { Users, UserPlus, Search, RefreshCw, Trash2, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserModal from './UserModal';
import DeleteUserModal from './DeleteUserModal';

export default function UserManagementTab({
  users = [], roles = [],
  onUserCreate, onUserUpdate, onUserDelete, onUserMfaReset,
  onRefresh, isLoading,
}) {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const createTriggerRef = useRef(null);
  const deleteTriggerRef = useRef(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || (u.email && u.email.toLowerCase().includes(q)) ||
        (`${u.first_names || ''} ${u.last_names || ''}`.toLowerCase().includes(q));
      const matchRole = !roleFilter || String(u.role_id) === String(roleFilter) || u.role_name === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const isCurrentSessionUser = (targetUser) => {
    if (!currentUser || !targetUser) return false;
    return String(currentUser.id) === String(targetUser.id) || currentUser.email === targetUser.email;
  };

  return (
    <div className="bg-hm-card/90 border border-hm-border rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hm-border/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-hm-gold flex items-center gap-2">
            <Users size={18} aria-hidden="true" />
            Gestión de Usuarios del Sistema
          </h2>
          <p className="text-xs text-hm-muted">Administración de credenciales, roles y estado de acceso.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            ref={createTriggerRef}
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-hm-gold text-slate-950 text-xs font-bold hover:bg-hm-goldHover transition-colors shrink-0"
          >
            <UserPlus size={14} aria-hidden="true" />
            <span>+ Nuevo Usuario</span>
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg border border-hm-border text-hm-muted hover:text-hm-gold hover:border-hm-gold/40 transition-colors"
            title="Actualizar lista de usuarios"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hm-muted" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-8 pr-3 py-1.5 bg-hm-elevated border border-hm-border rounded-lg text-xs text-hm-text focus:outline-none focus:border-hm-gold"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-1.5 bg-hm-elevated border border-hm-border rounded-lg text-xs text-hm-text focus:outline-none focus:border-hm-gold"
        >
          <option value="">Todos los Roles</option>
          {roles.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="p-6 text-center text-xs sm:text-sm text-hm-muted break-words bg-hm-elevated/40 rounded-lg border border-hm-border/40">
          No se encontraron usuarios con los filtros aplicados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-hm-border/60">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-hm-elevated/80 text-hm-muted uppercase tracking-wider font-semibold border-b border-hm-border">
              <tr>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Usuario</th>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Rol</th>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Estado</th>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">2FA</th>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Alta en Sistema</th>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hm-border/40">
              {filteredUsers.map((u) => {
                const isCurrent = isCurrentSessionUser(u);
                const fullName = `${u.first_names || ''} ${u.last_names || ''}`.trim() || u.email;
                return (
                  <tr key={u.id} className="hover:bg-hm-elevated/40 transition-colors">
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-hm-text">{fullName}</div>
                      <div className="text-[11px] text-hm-muted">{u.email}</div>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-hm-elevated border border-hm-border text-hm-gold">
                        {u.role_name || 'Analista'}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => !isCurrent && onUserUpdate(u.id, { is_active: !u.is_active })}
                        disabled={isCurrent || isLoading}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                          u.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-hm-danger/15 text-hm-danger'
                        } ${isCurrent ? 'cursor-default' : 'hover:opacity-80'}`}
                      >
                        {u.is_active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      {u.is_mfa_enabled ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 size={13} /> Activo
                        </span>
                      ) : (
                        <span className="text-hm-muted text-[11px]">Inactivo</span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-hm-muted font-mono whitespace-nowrap">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/D'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {u.is_mfa_enabled && (
                          <button
                            type="button"
                            onClick={() => onUserMfaReset(u.id)}
                            disabled={isLoading}
                            className="p-1.5 text-hm-warning hover:bg-hm-warning/10 rounded transition-colors"
                            title="Resetear 2FA"
                          >
                            <KeyRound size={15} />
                          </button>
                        )}
                        <button
                          ref={deleteTriggerRef}
                          type="button"
                          onClick={() => setUserToDelete(u)}
                          disabled={isCurrent || isLoading}
                          className={`p-1.5 rounded transition-colors ${isCurrent ? 'text-hm-muted/40 cursor-not-allowed' : 'text-hm-danger hover:bg-hm-danger/10'}`}
                          title={isCurrent ? 'No puede auto-eliminar su cuenta activa' : 'Eliminar usuario'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <UserModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} triggerRef={createTriggerRef} onSubmit={onUserCreate} roles={roles} isLoading={isLoading} />
      <DeleteUserModal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} triggerRef={deleteTriggerRef} userToDelete={userToDelete} onConfirm={onUserDelete} isLoading={isLoading} />
    </div>
  );
}
