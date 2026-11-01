import { apiClient } from './client';

export const getMyProfileApi = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const updateMyProfileApi = async (data) => {
  const response = await apiClient.put('/users/me', data);
  return response.data;
};

export const changePasswordApi = async (data) => {
  const response = await apiClient.put('/users/me/password', data);
  return response.data;
};

export const setupMfaApi = async () => {
  const response = await apiClient.post('/auth/mfa/setup');
  return response.data;
};

export const verifyMfaApi = async (code) => {
  const response = await apiClient.post('/auth/mfa/verify', { code });
  return response.data;
};

export const disableMfaApi = async (data = {}) => {
  const response = await apiClient.post('/auth/mfa/disable', data);
  return response.data;
};

export const verifyLoginMfaApi = async (mfaToken, code) => {
  const response = await apiClient.post('/auth/mfa/verify-login', {
    mfa_token: mfaToken,
    code,
  });
  return response.data;
};
