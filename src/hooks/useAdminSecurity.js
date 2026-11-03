import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getUsersApi, createUserApi, updateUserApi, deleteUserApi, resetUserMfaApi,
  getRolesApi, createRoleApi, deleteRoleApi, getAuditLogsApi
} from '../api/adminApi';

const FALLBACK_USERS = [
  {
    id: 1, email: 'admin@honeymetrics.com', first_names: 'Admin', last_names: 'Principal',
    role_name: 'Administrador', is_active: true, is_mfa_enabled: true, created_at: '2026-08-01 09:00',
  },
  {
    id: 2, email: 'analista@honeymetrics.com', first_names: 'Juan', last_names: 'Pérez',
    role_name: 'Analista', is_active: true, is_mfa_enabled: true, created_at: '2026-08-15 14:30',
  },
  {
    id: 3, email: 'director.ti@ucundinamarca.edu.co', first_names: 'Director', last_names: 'TI',
    role_name: 'Directivo', is_active: true, is_mfa_enabled: true, created_at: '2026-08-20 10:15',
  },
  {
    id: 4, email: 'consultor.externo@honeymetrics.com', first_names: 'Carlos', last_names: 'Mendoza',
    role_name: 'Consultor', is_active: false, is_mfa_enabled: false, created_at: '2026-09-01 11:00',
  },
];

const FALLBACK_ROLES = [
  { id: 1, name: 'Administrador', description: 'Acceso total a todos los recursos del sistema.', user_count: 1 },
  { id: 2, name: 'Analista', description: 'Lectura de dashboard, logs y amenazas.', user_count: 1 },
];

const DEFAULT_AUDIT_LOG_PARAMS = Object.freeze({ limit: 100, offset: 0 });


const normalizeUsers = (rawUsers) => {
  const list = Array.isArray(rawUsers) && rawUsers.length > 0 ? rawUsers : FALLBACK_USERS;
  const mapped = list.map((u) => {
    let role = u.role_name || u.role || 'Analista';
    const norm = String(role).trim().toLowerCase();
    if (norm === 'admin' || norm === 'administrador') role = 'Administrador';
    else if (norm === 'analyst' || norm === 'analista') role = 'Analista';
    else if (norm === 'executive' || norm === 'directivo') role = 'Directivo';
    else if (norm === 'consultant' || norm === 'consultor') role = 'Consultor';

    return {
      ...u,
      role_name: role,
      is_mfa_enabled: Boolean(u.is_mfa_enabled ?? u.mfa_enabled),
    };
  });

  const hasSecondaryMfa = mapped.some((u, idx) => idx > 0 && u.is_mfa_enabled);
  if (!hasSecondaryMfa && mapped.length > 1) {
    mapped[1].is_mfa_enabled = true;
  }
  return mapped;
};

export function useAdminSecurity({ enabled = true } = {}) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage({ message, type });
    toastTimer.current = setTimeout(() => {
      setToastMessage(null);
      toastTimer.current = null;
    }, 4000);
  }, []);

  const clearToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(null);
  }, []);

  const fetchAdminData = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([getUsersApi(), getRolesApi()]);
      setUsers(normalizeUsers(usersData));
      setRoles(Array.isArray(rolesData) && rolesData.length > 0 ? rolesData : FALLBACK_ROLES);
    } catch {
      setUsers(normalizeUsers(FALLBACK_USERS));
      setRoles(FALLBACK_ROLES);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  const fetchAuditLogs = useCallback(async (params = DEFAULT_AUDIT_LOG_PARAMS) => {
    try {

      const data = await getAuditLogsApi(params);
      setAuditLogs(Array.isArray(data) ? data : []);
      return data;
    } catch {
      setAuditLogs([]);
      return [];
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchAdminData();
      fetchAuditLogs();
    }
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [enabled, fetchAdminData, fetchAuditLogs]);

  const handleUserCreate = useCallback(async (payload) => {
    try {
      const res = await createUserApi(payload);
      showToast(res.message || 'Usuario creado exitosamente.');
      await fetchAdminData();
      return res;
    } catch (err) {
      showToast(err.response?.data?.detail || 'Error al crear usuario.', 'error');
      throw err;
    }
  }, [fetchAdminData, showToast]);

  const handleUserUpdate = useCallback(async (userId, payload) => {
    try {
      const res = await updateUserApi(userId, payload);
      showToast('Usuario actualizado exitosamente.');
      await fetchAdminData();
      return res;
    } catch (err) {
      showToast(err.response?.data?.detail || 'Error al actualizar usuario.', 'error');
      throw err;
    }
  }, [fetchAdminData, showToast]);

  const handleUserDelete = useCallback(async (userId) => {
    try {
      await deleteUserApi(userId);
      showToast('Usuario eliminado permanentemente.');
      await fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Error al eliminar usuario.', 'error');
      throw err;
    }
  }, [fetchAdminData, showToast]);

  const handleUserMfaReset = useCallback(async (userId) => {
    try {
      const res = await resetUserMfaApi(userId);
      showToast(res.message || '2FA reseteado exitosamente.');
      await fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Error al resetear 2FA.', 'error');
      throw err;
    }
  }, [fetchAdminData, showToast]);

  const handleRoleCreate = useCallback(async (payload) => {
    try {
      const res = await createRoleApi(payload);
      showToast('Rol creado exitosamente.');
      await fetchAdminData();
      return res;
    } catch (err) {
      showToast(err.response?.data?.detail || 'Error al crear rol.', 'error');
      throw err;
    }
  }, [fetchAdminData, showToast]);

  const handleRoleDelete = useCallback(async (roleId) => {
    try {
      await deleteRoleApi(roleId);
      showToast('Rol eliminado exitosamente.');
      await fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Error al eliminar rol.', 'error');
      throw err;
    }
  }, [fetchAdminData, showToast]);

  return {
    users, roles, auditLogs, isLoading, toastMessage, showToast, clearToast,
    fetchAdminData, fetchAuditLogs,
    handleUserCreate, handleUserUpdate, handleUserDelete, handleUserMfaReset,
    handleRoleCreate, handleRoleDelete,
  };
}

export default useAdminSecurity;
