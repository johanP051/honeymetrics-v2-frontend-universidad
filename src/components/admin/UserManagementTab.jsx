import React, { useState, useMemo, useRef } from 'react';
import { Users, UserPlus, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserModal from './UserModal';
import DeleteUserModal from './DeleteUserModal';
import ResetMfaModal from './ResetMfaModal';
import UserTableRow from './UserTableRow';
import { LogsPaginationActions } from '../../pages/Logs/LogsPaginationActions';

export default function UserManagementTab({
  users = [], roles = [],
  onUserCreate, onUserUpdate, onUserDelete, onUserMfaReset,
  onRefresh, isLoading,
}) {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToResetMfa, setUserToResetMfa] = useState(null);
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

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const isCurrentSessionUser = (targetUser) => {
    if (!currentUser || !targetUser) return false;
    return String(currentUser.id) === String(targetUser.id) || currentUser.email === targetUser.email;
  };

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (payload, userId) => {
    if (userId) {
      await onUserUpdate(userId, payload);
    } else {
      await onUserCreate(payload);
    }
  };

  const handleConfirmResetMfa = async () => {
    if (userToResetMfa && onUserMfaReset) {
      await onUserMfaReset(userToResetMfa.id);
      setUserToResetMfa(null);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 sm:p-5 space-y-4">
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
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-hm-gold text-slate-950 text-xs font-bold hover:bg-hm-goldHover transition-colors shrink-0"
            >
              <UserPlus size={14} aria-hidden="true" />
              <span>+ Nuevo Usuario</span>
            </button>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-hm-elevated border border-hm-border text-hm-muted hover:text-hm-gold hover:border-hm-gold/40 transition-colors"
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
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Buscar por nombre o correo..."
              className="w-full pl-8 pr-3 py-1.5 bg-hm-elevated border border-hm-border rounded-lg text-xs text-hm-text focus:outline-none focus:border-hm-gold"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
            className="px-3 py-1.5 bg-hm-elevated border border-hm-border rounded-lg text-xs text-hm-text focus:outline-none focus:border-hm-gold"
          >
            <option value="">Todos los Roles</option>
            {roles.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="p-8 text-center text-xs sm:text-sm text-hm-muted border-t border-hm-border/60">
          No se encontraron usuarios con los filtros aplicados.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border-t border-hm-border/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-hm-elevated/80 text-hm-muted uppercase tracking-wider font-semibold border-b border-hm-border">
                <tr>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">USUARIO</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">ROL ASIGNADO</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap text-center">ESTADO</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap text-center">2FA</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">ALTA EN SISTEMA</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hm-border/40">
                {paginatedUsers.map((u) => (
                  <UserTableRow
                    key={u.id}
                    user={u}
                    isCurrent={isCurrentSessionUser(u)}
                    isLoading={isLoading}
                    onUserUpdate={onUserUpdate}
                    onOpenResetMfa={setUserToResetMfa}
                    onOpenEdit={handleOpenEdit}
                    onOpenDelete={setUserToDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <LogsPaginationActions
            count={filteredUsers.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={(newRpp) => { setRowsPerPage(newRpp); setPage(0); }}
          />
        </>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        triggerRef={createTriggerRef}
        onSubmit={handleSaveUser}
        roles={roles}
        isLoading={isLoading}
        userToEdit={userToEdit}
      />
      <DeleteUserModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        triggerRef={deleteTriggerRef}
        userToDelete={userToDelete}
        onConfirm={onUserDelete}
        isLoading={isLoading}
      />
      <ResetMfaModal
        isOpen={!!userToResetMfa}
        onClose={() => setUserToResetMfa(null)}
        userToReset={userToResetMfa}
        onConfirm={handleConfirmResetMfa}
        isLoading={isLoading}
      />
    </div>
  );
}
