import api from "./client";

/**
 * API Client para el módulo de Exportación de Logs y Esquema Técnico de HoneyMetrics v2
 * Conecta con los endpoints bajo /api/v1/logs
 */

/**
 * Obtener historial persistente de exportaciones
 * @returns {Promise<Array>} Lista de exportaciones
 */
export async function getLogsHistory() {
  const response = await api.get("/logs/history");
  return response.data;
}

/**
 * Solicitar una nueva extracción de logs
 * @param {Object} params - Fechas de inicio y fin { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
 * @returns {Promise<Object>} Resultado de la solicitud
 */
export async function requestLogExport({ startDate, endDate }) {
  const response = await api.post("/logs/request-export", {
    startDate,
    endDate,
  });
  return response.data;
}

/**
 * Obtener estadísticas agregadas de decoders para generación de PDF
 * @param {string} exportId - Identificador de la exportación (ej. EXP-1045)
 * @returns {Promise<Object>} Estadísticas con labels, values, total_logs, start_date, end_date
 */
export async function getReportStats(exportId) {
  try {
    const response = await api.get(`/logs/report-stats/${exportId}`);
    return response.data;
  } catch (error) {
    console.warn(`No se pudieron obtener métricas para ${exportId}, usando valores por defecto:`, error);
    return null;
  }
}

/**
 * Descargar dataset JSONL de una exportación aprobada
 * @param {string} exportId - Identificador de la exportación
 */
export async function downloadLogExport(exportId) {
  const response = await api.get(`/logs/download/${exportId}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/x-ndjson" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `honeymetrics_${exportId}.jsonl`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
