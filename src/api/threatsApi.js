import { apiClient } from './client';

export const getThreatSummary = async (params = {}) => {
  const response = await apiClient.get('/threats/summary', { params });
  return response.data;
};

export const getTopPersistentThreats = async () => {
  const response = await apiClient.get('/threats/top-persistent');
  return response.data;
};

export const getDetectedBotnets = async () => {
  const response = await apiClient.get('/threats/botnets');
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
