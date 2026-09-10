import React, { useState, useMemo } from 'react';
import { Search, Filter, UserPlus, Edit3, Trash2, ShieldCheck, ShieldAlert, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import UserModal from './UserModal';
import DeleteUserModal from './DeleteUserModal';
import RolesSection from './RolesSection';

export default function UserManagementTab({
  users,
  roles,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onRoleCreate,
  onRoleDelete,
  onRefresh,
  isLoading,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modales
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filtrado reactivo en cliente
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = selectedRoleFilter === 'ALL' || String(u.role_id) === String(selectedRoleFilter);
      const matchStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'ACTIVE' && u.is_active) ||
        (selectedStatusFilter === 'INACTIVE' && !u.is_active);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, selectedRoleFilter, selectedStatusFilter]);

  const handleOpenCreateModal = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (payload, userId) => {
    setIsActionLoading(true);
    try {
      if (userId) {
        await onUserUpdate(userId, payload);
      } else {
        await onUserCreate(payload);
      }
      setIsUserModalOpen(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmDelete = async (userId) => {
    setIsActionLoading(true);
    try {
      await onUserDelete(userId);
      setIsDeleteModalOpen(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await onUserUpdate(user.id, { is_active: !user.is_active });
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al actualizar estado del usuario.');
    }
  };

  const getRoleBadgeColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'administrador':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'analista':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'consultor':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'directivo':
        return 'bg-hm-gold/20 text-hm-gold border-hm-gold/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Barra de Herramientas de Usuarios */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3 text-hm-muted" />
            <input
              type="text"
              placeholder="Buscar usuario por correo institucional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-hm-bg border border-hm-border rounded-lg pl-10 pr-4 py-2 text-xs text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-hm-muted hidden sm:inline" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-hm-bg border border-hm-border rounded-lg px-2.5 py-2 text-xs text-hm-text focus:outline-none focus:border-hm-gold"
            >
              <option value="ALL">Todos los Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-hm-bg border border-hm-border rounded-lg px-2.5 py-2 text-xs text-hm-text focus:outline-none focus:border-hm-gold"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="ACTIVE">Solo Activos</option>
              <option value="INACTIVE">Solo Inactivos</option>
            </select>

            <button
              type="button"
              onClick={onRefresh}
              title="Sincronizar usuarios"
              className="p-2 text-hm-muted hover:text-hm-gold hover:bg-hm-elevated border border-transparent hover:border-hm-border rounded-lg transition-colors"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-hm-gold text-hm-bg font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] text-xs shrink-0"
        >
          <UserPlus size={16} />
          <span>Nuevo Usuario (PB-HM-17)</span>
        </button>
      </div>

      {/* 2. Tabla de Usuarios (PB-HM-18) */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-hm-border flex items-center justify-between bg-hm-bg/50">
          <h3 className="text-base font-bold text-hm-text">
            Usuarios Registrados ({filteredUsers.length})
          </h3>
          <span className="text-xs text-hm-muted">Control de Acceso Basado en Roles (RBAC)</span>
        </div>

        <div className="w-full overflow-x-auto md:overflow-visible">
          <table className="w-full text-left">
            <thead className="bg-hm-elevated border-b border-hm-border">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider">USUARIO</th>
                <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider">ROL ASIGNADO</th>
                <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider text-center">ESTADO</th>
                <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider text-center">2FA</th>
                <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider">ALTA EN SISTEMA</th>
                <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hm-border/50 text-xs">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-hm-muted">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-hm-muted">
                    No se encontraron usuarios con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-hm-elevated/40 transition-colors">
                    {/* Usuario */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-hm-elevated border border-hm-border flex items-center justify-center font-bold text-xs text-hm-gold">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-mono text-hm-text block">{user.email}</span>
                          {user.must_change_password && (
                            <span className="text-[10px] text-yellow-400">Contraseña temporal activa</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getRoleBadgeColor(user.role_name)}`}>
                        {user.role_name}
                      </span>
                    </td>

                    {/* Estado con switch rápido */}
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        title={user.is_active ? 'Suspender cuenta' : 'Activar cuenta'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                          user.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20'
                        }`}
                      >
                        {user.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        <span>{user.is_active ? 'Activo' : 'Inactivo'}</span>
                      </button>
                    </td>

                    {/* 2FA */}
                    <td className="px-4 py-3 text-center">
                      {user.is_mfa_enabled ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400" title="2FA Activado">
                          <ShieldCheck size={16} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-hm-muted" title="2FA Desactivado">
                          <ShieldAlert size={16} />
                        </span>
                      )}
                    </td>

                    {/* Fecha de creación */}
                    <td className="px-4 py-3 text-hm-muted whitespace-nowrap">
                      {user.created_at || 'Preexistente'}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(user)}
                          title="Modificar usuario (PB-HM-19)"
                          className="p-1.5 text-hm-muted hover:text-hm-gold hover:bg-hm-elevated rounded-lg transition-colors"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(user)}
                          title="Eliminar usuario (PB-HM-20)"
                          className="p-1.5 text-hm-muted hover:text-hm-danger hover:bg-hm-danger/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Sección de Roles y Permisos (PB-HM-13 a PB-HM-16) */}
      <RolesSection
        roles={roles}
        onRoleCreate={onRoleCreate}
        onRoleDelete={onRoleDelete}
        isLoading={isLoading}
      />

      {/* Modales */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userToEdit={userToEdit}
        roles={roles}
        onSave={handleSaveUser}
        isLoading={isActionLoading}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userToDelete={userToDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
}
