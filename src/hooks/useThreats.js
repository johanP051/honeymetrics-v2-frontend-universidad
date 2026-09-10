import { useState, useEffect, useCallback } from 'react';
import { getThreatSummary } from '../api/threatsApi';
import { mockThreatSummary } from '../mocks/threatsMockData';

export const useThreats = (initialFilters = { range: '7d' }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState(mockThreatSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMockFallback, setIsMockFallback] = useState(false);

  const fetchThreats = useCallback(async (activeFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const liveData = await getThreatSummary(activeFilters);
      if (liveData && typeof liveData === 'object' && Object.keys(liveData).length > 0) {
        setData(liveData);
        setIsMockFallback(false);
      } else {
        setData(mockThreatSummary);
        setIsMockFallback(true);
      }
    } catch (err) {
      console.warn('Backend CTI no alcanzable en la red actual. Activando motor Mock Offline transparente:', err.message);
      // Fail-Safe / Offline Mode: mostramos los datos sintéticos de 165k logs sin quebrar la UI en 0
      setData(mockThreatSummary);
      setIsMockFallback(true);
      // Mensaje pedagógico amigable
      setError('Modo Demostración / Offline Activo (Backend no alcanzable en esta red. Visualizando telemetría CTI de contingencia).');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchThreats(filters);
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    data,
    loading,
    error,
    isMockFallback,
    filters,
    setFilters: updateFilters,
    refetch: () => fetchThreats(filters),
  };
};
