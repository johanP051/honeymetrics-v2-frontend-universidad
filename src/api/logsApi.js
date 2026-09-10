import { apiClient } from './client';

export const requestLogExportApi = async (startDate, endDate) => {
  const response = await apiClient.post('/logs/request-export', {
    startDate,
    endDate,
  });
  return response.data;
};

export const getLogsHistoryApi = async () => {
  const response = await apiClient.get('/logs/history');
  return response.data;
};

export const downloadLogExportApi = async (exportId) => {
  const response = await apiClient.get(`/logs/download/${exportId}`, {
    responseType: 'blob',
    timeout: 0, // Evitar el timeout de 3000ms del cliente base para descargas grandes
  });
  return response.data;
};

export const getReportStatsApi = async (exportId) => {
  try {
    const response = await apiClient.get(`/logs/report-stats/${exportId}`);
    return response.data;
  } catch (error) {
    console.warn(`No se pudo obtener report-stats para ${exportId}, usando datos locales.`, error);
    return null;
  }
};

