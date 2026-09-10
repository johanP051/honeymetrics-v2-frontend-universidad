import { apiClient } from './client';

/**
 * Obtiene todas las amenazas registradas en el Threat Intelligence Center.
 */
export const getThreats = async () => {
  const response = await apiClient.get('/threats-center/');
  return response.data;
};

/**
 * Registra una nueva amenaza en el backend de FastAPI.
 */
export const createThreat = async (data) => {
  const payload = {
    ...data,
    type: data.ip?.includes(':') ? 'IPv6' : 'IPv4',
  };
  const response = await apiClient.post('/threats-center/', payload);
  return response.data;
};

/**
 * Actualiza los campos de una amenaza existente por ID.
 */
export const updateThreat = async (id, data) => {
  const payload = {
    ...data,
    type: data.ip ? (data.ip.includes(':') ? 'IPv6' : 'IPv4') : undefined,
  };
  const response = await apiClient.put(`/threats-center/${id}`, payload);
  return response.data;
};

/**
 * Elimina una amenaza por su ID.
 */
export const deleteThreat = async (id) => {
  const response = await apiClient.delete(`/threats-center/${id}`);
  return response.data;
};
