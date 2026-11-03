import { useState, useEffect, useCallback } from 'react';
import {
  getBlacklistThreats,
  createBlacklistThreat,
  updateBlacklistThreat,
  deleteBlacklistThreat,
  getVaultThreatsApi,
} from '../api/threatsApi';

const DEFAULT_THREATS = [
  { id: 1, ip: '45.148.10.151', ip_type: 'IPv4', country: 'Rusia', threat_score: 93, category: 'Botnet', status: 'Bloqueada', notes: 'SSH brute force' }, // NOSONAR
  { id: 2, ip: '192.35.168.22', ip_type: 'IPv4', country: 'China', threat_score: 85, category: 'APT', status: 'Bloqueada', notes: 'C2 communication' }, // NOSONAR
  { id: 3, ip: '185.220.101.5', ip_type: 'IPv4', country: 'Alemania', threat_score: 78, category: 'Scanner', status: 'Bloqueada', notes: 'Tor exit node' }, // NOSONAR
  { id: 4, ip: '2001:0db8:85a3::8a2e:0370:7334', ip_type: 'IPv6', country: 'Países Bajos', threat_score: 45, category: 'Recon', status: 'Monitoreada', notes: 'Port scanning' }, // NOSONAR
];


const DEFAULT_VAULT = [
  { id: 991, ip: '198.51.100.24', ip_type: 'IPv4', country: 'Rusia', threat_score: 88, category: 'Botnet', status: 'Archivada', deleted_at: '2026-10-15T14:22:10Z', archived_by: 'SecOps Team' },
  { id: 992, ip: '203.0.113.195', ip_type: 'IPv4', country: 'Corea del Norte', threat_score: 95, category: 'APT', status: 'Archivada', deleted_at: '2026-10-18T09:15:30Z', archived_by: 'Sistema SOC' },
];

const normalizeThreat = (t) => {
  const score = Number(t?.threat_score ?? 0);
  const ipType = t?.ip_type || t?.type || (t?.ip?.includes(':') ? 'IPv6' : 'IPv4');
  return {
    ...t,
    ip_type: ipType,
    threat_score: score,
    status: t?.status || (score > 70 ? 'Bloqueada' : 'Monitoreada'),
  };
};

export function useThreatCRUD() {
  const [data, setData] = useState([]);
  const [vaultData, setVaultData] = useState(DEFAULT_VAULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchThreats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getBlacklistThreats();
      if (Array.isArray(response) && response.length > 0) {
        setData(response.map(normalizeThreat));
        setIsFallback(false);
      } else {
        setData(DEFAULT_THREATS.map(normalizeThreat));
        setIsFallback(true);
      }
    } catch (err) {
      console.warn('Error al cargar blacklist, usando contingencia:', err.message);
      setError(err.message || 'Error de conexión con el motor CTI');
      setData(DEFAULT_THREATS.map(normalizeThreat));
      setIsFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVault = useCallback(async () => {
    try {
      const response = await getVaultThreatsApi();
      if (Array.isArray(response)) {
        setVaultData(response.map(normalizeThreat));
      }
    } catch (err) {
      console.warn('Bóveda forense usando almacenamiento local:', err.message);
    }
  }, []);

  useEffect(() => {
    void fetchThreats();
    void fetchVault();
  }, [fetchThreats, fetchVault]);

  const addThreat = useCallback(async (threatData) => {
    setIsLoading(true);
    setError(null);
    const score = Number(threatData.threat_score || 0);
    const payload = {
      ...threatData,
      ip_type: threatData.ip_type || (threatData.ip?.includes(':') ? 'IPv6' : 'IPv4'),
      threat_score: score,
      status: score > 70 ? 'Bloqueada' : 'Monitoreada',
    };

    try {
      const created = await createBlacklistThreat(payload);
      const normalized = normalizeThreat(created || payload);
      setData((prev) => [normalized, ...prev]);
      return normalized;
    } catch (err) {
      console.warn('Fallback local al añadir amenaza:', err.message);
      const localThreat = normalizeThreat({ ...payload, id: Date.now() });
      setData((prev) => [localThreat, ...prev]);
      return localThreat;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateThreat = useCallback(async (id, updateData) => {
    setIsLoading(true);
    setError(null);
    const payload = {
      ...updateData,
      threat_score: Number(updateData.threat_score ?? 0),
    };

    try {
      const updated = await updateBlacklistThreat(id, payload);
      const normalized = normalizeThreat(updated || { ...payload, id });
      setData((prev) => prev.map((item) => (String(item.id) === String(id) ? normalized : item)));
      return normalized;
    } catch (err) {
      console.warn('Fallback local al actualizar amenaza:', err.message);
      const localUpdated = normalizeThreat({ ...payload, id });
      setData((prev) => prev.map((item) => (String(item.id) === String(id) ? { ...item, ...localUpdated } : item)));
      return localUpdated;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteThreat = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteBlacklistThreat(id);
    } catch (err) {
      console.warn('Eliminación física API con fallback en bóveda forense:', err.message);
    } finally {
      setData((prev) => {
        const itemToDelete = prev.find((item) => String(item.id) === String(id));
        if (itemToDelete) {
          const archived = {
            ...itemToDelete,
            status: 'Archivada',
            deleted_at: new Date().toISOString(),
            archived_by: 'Operador CTI',
          };
          setVaultData((vPrev) => [archived, ...vPrev]);
        }
        return prev.filter((item) => String(item.id) !== String(id));
      });
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    vaultData,
    isLoading,
    error,
    isFallback,
    fetchThreats,
    fetchVault,
    addThreat,
    updateThreat,
    deleteThreat,
  };
}

export default useThreatCRUD;
