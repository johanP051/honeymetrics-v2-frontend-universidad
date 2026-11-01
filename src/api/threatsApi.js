import api from './client';

export const getBlacklistThreats = async () => {
  const response = await api.get('/blacklist/');
  return response.data;
};

export const createBlacklistThreat = async (payload) => {
  const response = await api.post('/blacklist/', payload);
  return response.data;
};

export const updateBlacklistThreat = async (id, payload) => {
  const response = await api.put(`/blacklist/${id}`, payload);
  return response.data;
};

export const deleteBlacklistThreat = async (id) => {
  const response = await api.delete(`/blacklist/${id}`);
  return response.data;
};

export const getVaultThreatsApi = async () => {
  try {
    const response = await api.get('/threats/blacklist/vault');
    return response.data;
  } catch (err) {
    try {
      const fallbackResp = await api.get('/blacklist/vault');
      return fallbackResp.data;
    } catch (_) {
      throw err;
    }
  }
};
