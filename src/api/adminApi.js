import { apiClient } from './client';

export const getUsersApi = async (params = {}) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const createUserApi = async (data) => {
  const response = await apiClient.post('/admin/users', data);
  return response.data;
};

export const updateUserApi = async (userId, data) => {
  const response = await apiClient.put(`/admin/users/${userId}`, data);
  return response.data;
};

export const deleteUserApi = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};

export const resetUserMfaApi = async (userId) => {
  const response = await apiClient.post(`/admin/users/${userId}/mfa/reset`);
  return response.data;
};

export const getRolesApi = async () => {
  const response = await apiClient.get('/roles');
  return response.data;
};

export const createRoleApi = async (data) => {
  const response = await apiClient.post('/roles', data);
  return response.data;
};

export const deleteRoleApi = async (roleId) => {
  const response = await apiClient.delete(`/roles/${roleId}`);
  return response.data;
};

export const getAuditLogsApi = async (params = {}) => {
  const response = await apiClient.get('/admin/audit-logs', { params });
  return response.data;
};
