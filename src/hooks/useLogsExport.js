import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { generarReportePdf } from '../utils/pdf/PdfGenerator';

/**
 * Custom Hook para el manejo asíncrono, polling reactivo y orquestación
 * de descargas y reportes del historial de exportaciones de logs.
 */
export function useLogsExport() {
  const [rows, setRows] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [descargandoId, setDescargandoId] = useState(null);
  const [generandoReporteId, setGenerandoReporteId] = useState(null);
  const [errorReporte, setErrorReporte] = useState('');
  const [anuncioAccesible, setAnuncioAccesible] = useState('');

  const cargarLogs = useCallback(async (mostrarLoading = true) => {
    try {
      if (mostrarLoading) setCargando(true);
      setError('');
      const respuesta = await api.get('/logs/history');
      if (Array.isArray(respuesta.data)) {
        setRows(respuesta.data);
      }
    } catch (err) {
      console.warn('Error al cargar historial de logs:', err);
      setError('No fue posible cargar el historial de exportaciones.');
    } finally {
      if (mostrarLoading) setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarLogs(true);
  }, [cargarLogs]);

  // Polling automático (10s normal, 3s acelerado si hay tareas "Procesando")
  useEffect(() => {
    const hayEnProceso = rows.some((row) => row.status === 'Procesando');
    const intervaloMs = hayEnProceso ? 3000 : 10000;
    const timer = setInterval(() => {
      cargarLogs(false);
    }, intervaloMs);
    return () => clearInterval(timer);
  }, [rows, cargarLogs]);

  const handleDownload = async (exportId) => {
    try {
      setDescargandoId(exportId);
      setAnuncioAccesible(`Descargando archivo de exportación ${exportId}...`);
      const response = await api.get(`/logs/download/${exportId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/x-ndjson',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exportId}.jsonl`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setAnuncioAccesible(`Descarga de exportación ${exportId} completada.`);
    } catch (err) {
      console.error('Error al descargar el archivo:', err);
      setAnuncioAccesible(`Error al descargar la exportación ${exportId}.`);
    } finally {
      setDescargandoId(null);
    }
  };

  const handleGenerarReporte = async (exportId) => {
    try {
      setErrorReporte('');
      setGenerandoReporteId(exportId);
      setAnuncioAccesible(`Generando reporte PDF para exportación ${exportId}...`);
      const respuesta = await api.get(`/logs/report-stats/${exportId}`);
      await generarReportePdf(exportId, respuesta.data);
      setAnuncioAccesible(`Reporte PDF para exportación ${exportId} generado exitosamente.`);
    } catch (err) {
      console.error('Error al generar el reporte PDF:', err);
      setErrorReporte('No fue posible generar el PDF. Verifica que la exportación esté lista e inténtalo nuevamente.');
      setAnuncioAccesible('Error al generar el reporte PDF.');
    } finally {
      setGenerandoReporteId(null);
    }
  };

  const handleDownloadLatestDictionary = async () => {
    const ultimaExportacion = rows.find(
      (item) => item.status === 'COMPLETED' || item.status === 'Listo' || item.status === 'completed'
    ) || rows[0];
    const exportId = ultimaExportacion?.id || 'EXP-CANONICAL';
    try {
      setErrorReporte('');
      setAnuncioAccesible('Generando Diccionario de Datos y Reporte PDF...');
      let stats = null;
      if (ultimaExportacion?.id) {
        try {
          const resp = await api.get(`/logs/report-stats/${ultimaExportacion.id}`);
          stats = resp.data;
        } catch (e) {
          console.warn('Usando estadísticas base para diccionario:', e);
        }
      }
      await generarReportePdf(exportId, stats || {});
      setAnuncioAccesible('Diccionario de Datos generado exitosamente.');
    } catch (err) {
      console.error('Error al generar diccionario:', err);
      setErrorReporte('No fue posible generar el Diccionario PDF.');
    }
  };

  const handleExportSuccess = (nuevoRegistro) => {
    if (nuevoRegistro) {
      setRows((prev) => {
        if (prev.some((r) => r.id === nuevoRegistro.id)) return prev;
        const filaOptimista = {
          id: nuevoRegistro.id,
          date_range: nuevoRegistro.date_range || 'En proceso',
          count: nuevoRegistro.count || 0,
          status: nuevoRegistro.status,
          created_at: 'Hace un momento',
          file_format: 'JSONL',
        };
        return [filaOptimista, ...prev];
      });
    }
    cargarLogs(false);
    setAnuncioAccesible('Nueva exportación solicitada. La lista ha sido actualizada.');
  };

  return {
    rows,
    setRows,
    cargando,
    error,
    descargandoId,
    generandoReporteId,
    errorReporte,
    anuncioAccesible,
    setAnuncioAccesible,
    cargarLogs,
    handleDownload,
    handleGenerarReporte,
    handleDownloadLatestDictionary,
    handleExportSuccess,
  };
}

export default useLogsExport;
