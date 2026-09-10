import { useState, useEffect, useCallback } from 'react';
import { initialLogsHistory } from '../mocks/logsDatabase';
import { requestLogExportApi, getLogsHistoryApi } from '../api/logsApi';

/**
 * Custom Hook para el manejo asíncrono y persistente de solicitudes de exportación
 * de logs crudos (PB-HM-37 a PB-HM-41).
 * Conecta con FastAPI (/api/v1/logs/history y /api/v1/logs/request-export).
 */
export const useLogsExport = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar historial desde la base de datos
  const fetchHistory = useCallback(async () => {
    try {
      const history = await getLogsHistoryApi();
      if (Array.isArray(history) && history.length > 0) {
        setData(history);
      } else {
        setData(initialLogsHistory);
      }
    } catch (error) {
      console.warn('No se pudo conectar con el backend para el historial, usando datos locales:', error.message);
      setData((prev) => (prev.length > 0 ? prev : initialLogsHistory));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const requestExport = useCallback(async (startDate, endDate) => {
    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = now.toLocaleString('es-ES', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      // 1. Petición al Backend real (FastAPI persiste en BD y dispara alerta a Telegram si >50k)
      const res = await requestLogExportApi(startDate, endDate);

      const newRequest = {
        id: res.id,
        date_range: `${startDate} / ${endDate}`,
        count: res.count,
        status: res.status,
        created_at: formattedDate,
        file_format: 'JSONL',
      };

      setData((prev) => [newRequest, ...prev]);

      // Si es procesamiento estándar (<50k logs), simulamos que Celery lo completa a los 5s
      if (res.status === 'Procesando') {
        setTimeout(() => {
          setData((prev) =>
            prev.map((item) =>
              item.id === res.id ? { ...item, status: 'Listo' } : item
            )
          );
        }, 5000);
      }

      return newRequest;
    } catch (error) {
      console.warn('Fallo de conexión con backend, ejecutando fallback local:', error.message);
      // Fallback local en caso de desconexión
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const newId = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;
      const isLarge = diffDays > 7;
      const count = isLarge ? Math.floor(52000 + (diffDays - 7) * 8000) : Math.max(450, diffDays * 2200);

      const fallbackRequest = {
        id: newId,
        date_range: `${startDate} / ${endDate}`,
        count,
        status: isLarge ? 'Pendiente de Aprobación' : 'Procesando',
        created_at: formattedDate,
        file_format: 'JSONL',
      };

      setData((prev) => [fallbackRequest, ...prev]);
      return fallbackRequest;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    data,
    isLoading,
    isSubmitting,
    requestExport,
    refreshHistory: fetchHistory,
  };
};
