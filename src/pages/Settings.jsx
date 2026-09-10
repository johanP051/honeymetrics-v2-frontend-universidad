import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, User, Users, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getMyProfileApi,
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getRolesApi,
  createRoleApi,
  deleteRoleApi,
} from '../api/usersApi';
import { initialMockUsers, initialMockRoles } from '../mocks/usersDatabase';
import ProfileSecurityTab from '../components/settings/ProfileSecurityTab';
import UserManagementTab from '../components/settings/UserManagementTab';

export default function Settings() {
  const { user: authUser, role: authRole } = useAuth();

  const [activeTab, setActiveTab] = useState('PROFILE'); // 'PROFILE' | 'ADMIN'
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const isAdmin = (authRole || profile?.role_name || '').toLowerCase() === 'administrador';

  // 1. Cargar Perfil propio
  const fetchProfile = useCallback(async () => {
    try {
      const data = await getMyProfileApi();
      setProfile(data);
    } catch (err) {
      console.warn('Fallback local para perfil:', err.message);
      setProfile({
        id: 1,
        email: authUser?.email || 'admin@ucundinamarca.edu.co',
        role_name: authRole || 'Administrador',
        is_active: true,
        is_mfa_enabled: false,
        must_change_password: false,
        created_at: '2026-08-01 09:00',
      });
    }
  }, [authUser, authRole]);

  // 2. Cargar Usuarios y Roles (solo si es Admin)
  const fetchAdminData = useCallback(async () => {
    try {
      const [usersData, rolesData] = await Promise.all([getUsersApi(), getRolesApi()]);
      if (Array.isArray(usersData) && usersData.length > 0) {
        setUsers(usersData);
      } else {
        setUsers(initialMockUsers);
      }

      if (Array.isArray(rolesData) && rolesData.length > 0) {
        setRoles(rolesData);
      } else {
        setRoles(initialMockRoles);
      }
    } catch (err) {
      console.warn('Fallback local para gestión de usuarios y roles:', err.message);
      setUsers(initialMockUsers);
      setRoles(initialMockRoles);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await fetchProfile();
      await fetchAdminData();
      setIsLoading(false);
    };
    loadAll();
  }, [fetchProfile, fetchAdminData]);

  // Operaciones de Usuarios
  const handleUserCreate = async (payload) => {
    try {
      const response = await createUserApi(payload);
      showToast(response.message || 'Usuario creado exitosamente.');
      await fetchAdminData();
    } catch (err) {
      console.warn('Ejecutando fallback de creación local:', err.message);
      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const roleObj = roles.find((r) => r.id === payload.role_id);
      const newUser = {
        id: newId,
        email: payload.email,
        role_id: payload.role_id,
        role_name: roleObj ? roleObj.name : 'Analista',
        is_active: true,
        is_mfa_enabled: false,
        must_change_password: true,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast('Usuario registrado en memoria (modo local).');
    }
  };

  const handleUserUpdate = async (userId, payload) => {
    try {
      await updateUserApi(userId, payload);
      showToast('Usuario actualizado correctamente.');
      await fetchAdminData();
    } catch (err) {
      console.warn('Ejecutando fallback de actualización local:', err.message);
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            const roleObj = payload.role_id ? roles.find((r) => r.id === payload.role_id) : null;
            return {
              ...u,
              ...payload,
              role_name: roleObj ? roleObj.name : u.role_name,
            };
          }
          return u;
        })
      );
      showToast('Usuario actualizado en memoria (modo local).');
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      await deleteUserApi(userId);
      showToast('Usuario eliminado del sistema.');
      await fetchAdminData();
    } catch (err) {
      console.warn('Ejecutando fallback de eliminación local:', err.message);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('Usuario eliminado en memoria (modo local).');
    }
  };

  // Operaciones de Roles
  const handleRoleCreate = async (payload) => {
    try {
      await createRoleApi(payload);
      showToast('Rol creado exitosamente.');
      await fetchAdminData();
    } catch (err) {
      console.warn('Ejecutando fallback de creación de rol local:', err.message);
      const newRoleId = roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
      const newRole = {
        id: newRoleId,
        name: payload.name,
        description: payload.description,
        user_count: 0,
      };
      setRoles((prev) => [...prev, newRole]);
      showToast('Rol registrado en memoria (modo local).');
    }
  };

  const handleRoleDelete = async (roleId, roleName) => {
    if (!window.confirm(`¿Estás seguro de eliminar el rol '${roleName}'?`)) return;
    try {
      await deleteRoleApi(roleId);
      showToast(`Rol '${roleName}' eliminado.`);
      await fetchAdminData();
    } catch (err) {
      console.warn('Ejecutando fallback de eliminación de rol local:', err.message);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      showToast(`Rol '${roleName}' eliminado en memoria (modo local).`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Toast flotante */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border backdrop-blur-md animate-slide-up text-sm font-medium ${
            toastMessage.type === 'error'
              ? 'bg-hm-danger/20 border-hm-danger/40 text-hm-danger'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hm-border/70 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-hm-gold flex items-center gap-3">
            <SettingsIcon size={32} />
            Configuración & Gestión
          </h1>
          <p className="text-hm-muted mt-2 text-sm">
            Gestión integral de credenciales, segundo factor 2FA y administración de accesos (RBAC).
          </p>
        </div>

        {/* Pestañas de Navegación (Tabs) */}
        <div className="flex items-center p-1.5 bg-hm-elevated/80 border border-hm-border rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PROFILE'
                ? 'bg-hm-gold text-hm-bg shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'text-hm-muted hover:text-hm-text'
            }`}
          >
            <User size={15} />
            <span>Mi Perfil & Seguridad</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('ADMIN')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ADMIN'
                  ? 'bg-hm-gold text-hm-bg shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'text-hm-muted hover:text-hm-text'
              }`}
            >
              <Users size={15} />
              <span>Gestión de Usuarios & Roles</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenido Dinámico por Pestaña */}
      {activeTab === 'PROFILE' ? (
        <ProfileSecurityTab profile={profile} onProfileUpdate={fetchProfile} />
      ) : (
        isAdmin && (
          <UserManagementTab
            users={users}
            roles={roles}
            onUserCreate={handleUserCreate}
            onUserUpdate={handleUserUpdate}
            onUserDelete={handleUserDelete}
            onRoleCreate={handleRoleCreate}
            onRoleDelete={handleRoleDelete}
            onRefresh={fetchAdminData}
            isLoading={isLoading}
          />
        )
      )}
    </div>
  );
}
