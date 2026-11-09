import React, { useState, useMemo, useEffect, useRef } from 'react';
import useLogsExport from '../../hooks/useLogsExport';
import StatusBanner from '../../components/layout/StatusBanner';
import ExportLogsModal from '../../components/common/ExportLogsModal';
import LogsHeaderToolbar from './LogsHeaderToolbar';
import LogsTableBody from './LogsTableBody';
import {
  LogsPaginationActions,
  SortableHeader,
  parseFechaSolicitud,
} from './LogsPaginationActions';

export default function Logs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuFiltrosAbierto, setMenuFiltrosAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');
  const [orden, setOrden] = useState({ columna: null, direccion: 'asc' });
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const filterButtonRef = useRef(null);

  const {
    rows,
    cargando,
    error,
    isFallback,
    descargandoId,
    generandoReporteId,
    errorReporte,
    anuncioAccesible,
    setAnuncioAccesible,
    refreshLogs,
    handleDownload,
    handleGenerarReporte,
    handleExportSuccess,
  } = useLogsExport();

  const estados = useMemo(() => [...new Set(rows.map((r) => r.status))], [rows]);

  useEffect(() => {
    if (estados.length > 0 && estadosSeleccionados.length === 0) {
      setEstadosSeleccionados(estados);
    }
  }, [estados, estadosSeleccionados.length]);

  const rowsVisibles = useMemo(() => {
    const termino = busquedaAplicada.trim().toLowerCase();
    const filtradas = rows.filter((row) => {
      const matchSearch = !termino || [row.id, row.count, row.created_at, row.date_range].some((v) => String(v || '').toLowerCase().includes(termino));
      const matchStatus = estadosSeleccionados.includes(row.status);
      return matchSearch && matchStatus;
    });

    if (!orden.columna) return filtradas;

    return [...filtradas].sort((a, b) => {
      let comp = 0;
      if (orden.columna === 'count') comp = Number(a.count) - Number(b.count);
      else if (orden.columna === 'created_at') comp = parseFechaSolicitud(a.created_at) - parseFechaSolicitud(b.created_at);
      else comp = String(a[orden.columna] || '').localeCompare(String(b[orden.columna] || ''), undefined, { numeric: true });
      return orden.direccion === 'asc' ? comp : -comp;
    });
  }, [rows, busquedaAplicada, orden, estadosSeleccionados]);

  useEffect(() => {
    if (cargando) return;
    setAnuncioAccesible(busquedaAplicada ? `Búsqueda aplicada. ${rowsVisibles.length} registros.` : `Mostrando ${rowsVisibles.length} registros.`);
  }, [busquedaAplicada, rowsVisibles.length, cargando, setAnuncioAccesible]);

  const handleOrdenar = (columna) => {
    setOrden((prev) => {
      const dir = prev.columna === columna && prev.direccion === 'asc' ? 'desc' : 'asc';
      setAnuncioAccesible(`Tabla ordenada por ${columna} (${dir}).`);
      return { columna, direccion: dir };
    });
    setPage(0);
  };

  const handleAlternarEstado = (estado) => {
    setEstadosSeleccionados((prev) => (prev.includes(estado) ? prev.filter((e) => e !== estado) : [...prev, estado]));
    setPage(0);
  };

  return (
    <div className="space-y-6 animate-fade-up pb-10">
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {anuncioAccesible}
      </div>

      <div>
        <LogsHeaderToolbar
          onOpenExportModal={() => setIsExportModalOpen(true)}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          onBuscar={(e) => { e.preventDefault(); setBusquedaAplicada(busqueda); setPage(0); }}
          menuFiltrosAbierto={menuFiltrosAbierto}
          estados={estados}
          estadosSeleccionados={estadosSeleccionados}
          onAlternarFiltro={() => setMenuFiltrosAbierto((v) => !v)}
          onCerrarFiltro={() => setMenuFiltrosAbierto(false)}
          onAlternarEstado={handleAlternarEstado}
          onLimpiar={() => { setBusqueda(''); setBusquedaAplicada(''); setPage(0); }}
          filterButtonRef={filterButtonRef}
        />
        <div className="mt-4">
          <StatusBanner isFallback={isFallback} error={error} endpoint="/api/v1/logs/history" />
        </div>
      </div>

      {errorReporte && (
        <div className="p-3 bg-hm-danger/10 border border-hm-danger/30 text-hm-danger text-sm rounded-lg" role="alert" aria-live="assertive">
          {errorReporte}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse" aria-label="Historial de exportaciones de logs">
            <thead className="bg-hm-elevated/80 text-hm-muted text-xs uppercase tracking-wider border-b border-hm-border">
              <tr>
                <SortableHeader etiqueta="ID" columna="id" orden={orden} onOrdenar={handleOrdenar} />
                <SortableHeader etiqueta="Rango de Logs" columna="date_range" align="left" orden={orden} onOrdenar={handleOrdenar} />
                <SortableHeader etiqueta="Cantidad" columna="count" align="right" orden={orden} onOrdenar={handleOrdenar} />
                <SortableHeader etiqueta="Fecha de Solicitud" columna="created_at" align="right" orden={orden} onOrdenar={handleOrdenar} />
                <th scope="col" className="p-4 text-xs font-semibold uppercase tracking-wider text-center text-hm-muted">
                  Estado
                </th>
                <th scope="col" className="p-4 text-xs font-semibold uppercase tracking-wider text-right text-hm-muted">
                  Acción
                </th>
              </tr>
            </thead>

            <LogsTableBody
              cargando={cargando}
              totalRows={rows.length}
              error={error}
              estadosSeleccionados={estadosSeleccionados}
              rowsVisibles={rowsVisibles}
              rowsPerPage={rowsPerPage}
              page={page}
              descargandoId={descargandoId}
              generandoReporteId={generandoReporteId}
              onDownload={handleDownload}
              onGenerarReporte={handleGenerarReporte}
            />
          </table>
        </div>

        <LogsPaginationActions
          count={rowsVisibles.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(newRpp) => { setRowsPerPage(newRpp); setPage(0); }}
        />
      </div>

      <ExportLogsModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportSuccess={handleExportSuccess}
      />
    </div>
  );
}
