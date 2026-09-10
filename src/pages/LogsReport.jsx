import React, { useState } from 'react';
import { FileJson, FileText, CheckCircle, Clock, Download, AlertTriangle, XCircle, Send, RefreshCw, Loader2, Info, Plus } from 'lucide-react';
import { generateDictionaryPDF } from '../utils/PdfGenerator';
import ExportModal from '../components/logs/ExportModal';
import { useLogsExport } from '../hooks/useLogsExport';
import { downloadLogExportApi } from '../api/logsApi';

export default function LogsReport() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const { data: exportHistory, isLoading, isSubmitting, requestExport, refreshHistory } = useLogsExport();

  const handleDownloadJSONL = (row) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const downloadUrl = `${baseUrl}/logs/download/${row.id}`;
      
      // Delegamos la descarga al gestor nativo del navegador (cero impacto en RAM y 100% en segundo plano)
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `honeymetrics_${row.id}.jsonl`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Cumplimiento BDD PB-HM-39: notificar que el archivo expira en 7 días
      setToastMessage(`Descarga de ${row.id} iniciada (${row.count.toLocaleString()} registros) de forma nativa en tu navegador. El archivo estará disponible en el servidor durante 7 días.`);
      setTimeout(() => setToastMessage(null), 7000);
    } catch (error) {
      console.error('Error al descargar JSONL:', error);
      alert(`No se pudo iniciar la descarga de ${row.id}.`);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Listo':
        return (
          <span className="inline-flex items-center gap-1 text-hm-success border border-hm-success/30 bg-hm-success/10 px-2.5 py-1 rounded text-xs whitespace-nowrap">
            <CheckCircle size={13} /> Listo
          </span>
        );
      case 'Procesando':
        return (
          <span className="inline-flex items-center gap-1 text-hm-gold border border-hm-gold/30 bg-hm-gold/10 px-2.5 py-1 rounded text-xs whitespace-nowrap">
            <Clock size={13} className="animate-spin" /> Procesando
          </span>
        );
      case 'Pendiente de Aprobación':
        return (
          <span className="inline-flex items-center gap-1 text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-1 rounded text-xs whitespace-nowrap" title="Requiere confirmación manual del Administrador por Telegram">
            <AlertTriangle size={13} /> Pendiente
          </span>
        );
      case 'Rechazada':
        return (
          <span className="inline-flex items-center gap-1 text-hm-danger border border-hm-danger/30 bg-hm-danger/10 px-2.5 py-1 rounded text-xs whitespace-nowrap">
            <XCircle size={13} /> Rechazada
          </span>
        );
      default:
        return (
          <span className="text-hm-muted text-xs">{status}</span>
        );
    }
  };

  const renderActionCell = (row) => {
    if (row.status === 'Listo') {
      const isThisDownloading = downloadingId === row.id;
      return (
        <div className="flex justify-end gap-2">
          <button
            title="Descargar JSONL de Logs"
            disabled={isThisDownloading}
            onClick={() => handleDownloadJSONL(row)}
            className="p-1.5 text-hm-success hover:bg-hm-success/20 rounded-lg transition-colors border border-transparent hover:border-hm-success/30 disabled:opacity-50"
          >
            {isThisDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </button>
          <button
            title="Descargar Esquema Canónico (PDF)"
            onClick={() => generateDictionaryPDF(row)}
            className="p-1.5 text-hm-gold hover:bg-hm-gold/20 rounded-lg transition-colors border border-transparent hover:border-hm-gold/30"
          >
            <FileText size={16} />
          </button>
        </div>
      );
    }

    if (row.status === 'Pendiente de Aprobación') {
      return (
        <div className="flex justify-end">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-yellow-300 bg-yellow-500/10 border border-yellow-400/30 px-2 py-0.5 rounded-full whitespace-nowrap">
            <Send size={11} />
            Esperando Telegram
          </span>
        </div>
      );
    }

    if (row.status === 'Procesando') {
      return <span className="text-xs text-hm-muted">En cola Celery...</span>;
    }

    return <span className="text-hm-muted text-sm">-</span>;
  };

  return (
    <div className="animate-fade-up pb-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-hm-gold flex items-center gap-3">
            <FileText size={32} />
            Logs & Reportes
          </h1>
          <p className="text-hm-muted mt-2">Exportación de datos crudos y documentación técnica.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => generateDictionaryPDF(exportHistory[0] || null)}
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-hm-gold text-hm-gold rounded-lg hover:bg-hm-gold/10 transition-colors text-sm font-semibold"
          >
            <FileText size={16} />
            <span>Descargar Diccionario (PDF)</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-hm-gold text-hm-bg border border-hm-gold rounded-lg hover:bg-yellow-500 hover:text-hm-bg transition-colors text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <Plus size={16} />
            <span>Nuevo Export</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-hm-elevated border border-hm-gold/40 flex items-center gap-3 text-sm text-hm-text shadow-lg animate-fade-in">
          <Info size={20} className="text-hm-gold flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full">
        {/* Columna Izquierda - Tabla Historial */}
        
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-hm-border flex items-center justify-between bg-hm-bg/50">
              <h2 className="text-lg font-bold text-hm-text">Historial de Exportaciones</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={refreshHistory}
                  title="Sincronizar historial con el servidor"
                  className="p-1.5 text-hm-muted hover:text-hm-gold hover:bg-hm-elevated border border-transparent hover:border-hm-border rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                </button>

              </div>
            </div>
            <div className="w-full overflow-x-auto md:overflow-visible">
              <table className="w-full text-left">
                <thead className="bg-hm-elevated border-b border-hm-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider whitespace-nowrap">RANGO DE LOGS</th>
                    <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider">CANTIDAD</th>
                    <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider">FECHA SOLICITUD</th>
                    <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider text-center">ESTADO</th>
                    <th className="px-4 py-3 text-xs font-semibold text-hm-muted tracking-wider text-right">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hm-border/50">
                  {isLoading && exportHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-hm-muted">
                        Cargando historial de exportaciones...
                      </td>
                    </tr>
                  ) : exportHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-hm-muted">
                        No hay solicitudes de exportación registradas.
                      </td>
                    </tr>
                  ) : (
                    exportHistory.map((row) => (
                      <tr key={row.id} className="hover:bg-hm-elevated/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-hm-gold text-sm font-semibold">{row.id}</td>
                        <td className="px-4 py-3 text-hm-text text-sm whitespace-nowrap">{row.date_range}</td>
                        <td className="px-4 py-3 text-hm-muted text-sm font-mono">{row.count.toLocaleString()}</td>
                        <td className="px-4 py-3 text-hm-muted text-xs whitespace-nowrap">{row.created_at}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          {renderStatusBadge(row.status)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {renderActionCell(row)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      <ExportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRequestExport={requestExport}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
