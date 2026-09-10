import { useState, useEffect, useCallback } from 'react';
import {
  getThreats,
  createThreat,
  updateThreat as apiUpdateThreat,
  deleteThreat as apiDeleteThreat,
} from '../api/threatCenterApi';

export const useThreatCRUD = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchThreats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const threats = await getThreats();
      if (Array.isArray(threats) && threats.length > 0) {
        setData(threats);
      } else {
        const { initialThreats } = await import('../mocks/threatsDatabase');
        setData(initialThreats);
      }
    } catch (err) {
      console.warn('Backend CTI no disponible para Threat Center, activando amenazas mock de contingencia:', err.message);
      const { initialThreats } = await import('../mocks/threatsDatabase');
      setData(initialThreats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreats();
  }, [fetchThreats]);

  const addThreat = useCallback(async (threatData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newThreat = await createThreat(threatData);
      setData(prev => [newThreat, ...prev]);
      return newThreat;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error al registrar la amenaza.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateThreat = useCallback(async (id, newData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await apiUpdateThreat(id, newData);
      setData(prev => prev.map(item => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error al actualizar la amenaza.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteThreat = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiDeleteThreat(id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error al eliminar la amenaza.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    setError,
    fetchThreats,
    addThreat,
    updateThreat,
    deleteThreat,
  };
};

export default useThreatCRUD;
