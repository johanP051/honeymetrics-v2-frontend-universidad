import { apiClient } from './client';

export const getMyProfileApi = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const changePasswordApi = async (data) => {
  const response = await apiClient.put('/users/me/password', data);
  return response.data;
};

export const setupMfaApi = async () => {
  const response = await apiClient.post('/users/me/mfa/setup');
  return response.data;
};

export const verifyMfaApi = async (code) => {
  const response = await apiClient.post('/users/me/mfa/verify', { code });
  return response.data;
};

export const disableMfaApi = async () => {
  const response = await apiClient.post('/users/me/mfa/disable');
  return response.data;
};

export const getUsersApi = async (params = {}) => {
  const response = await apiClient.get('/users', { params });
  return response.data;
};

export const createUserApi = async (data) => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

export const updateUserApi = async (userId, data) => {
  const response = await apiClient.put(`/users/${userId}`, data);
  return response.data;
};

export const deleteUserApi = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
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
