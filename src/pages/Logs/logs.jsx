import React, { useState, useMemo, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import SpeedDial from '../../components/common/speedDial';
import useLogsExport from '../../hooks/useLogsExport';
import LogsHeaderToolbar from './LogsHeaderToolbar';
import LogsTableBody from './LogsTableBody';
import {
  TablePaginationActions,
  SortableHeader,
  parseFechaSolicitud,
} from './LogsPaginationActions';
import styles from './logs.module.css';
import style from '../Blacklist/blacklist.module.css';

export default function Logs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuFiltrosAbierto, setMenuFiltrosAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');
  const [orden, setOrden] = useState({ columna: null, direccion: 'asc' });
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
  const filterButtonRef = useRef(null);

  const {
    rows,
    cargando,
    error,
    descargandoId,
    generandoReporteId,
    errorReporte,
    anuncioAccesible,
    setAnuncioAccesible,
    handleDownload,
    handleGenerarReporte,
    handleDownloadLatestDictionary,
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
      const matchSearch = !termino || [row.id, row.count, row.created_at].some((v) => String(v).toLowerCase().includes(termino));
      const matchStatus = estadosSeleccionados.includes(row.status);
      return matchSearch && matchStatus;
    });

    if (!orden.columna) return filtradas;

    return [...filtradas].sort((a, b) => {
      let comp = 0;
      if (orden.columna === 'count') comp = Number(a.count) - Number(b.count);
      else if (orden.columna === 'created_at') comp = parseFechaSolicitud(a.created_at) - parseFechaSolicitud(b.created_at);
      else comp = String(a[orden.columna]).localeCompare(String(b[orden.columna]), undefined, { numeric: true });
      return orden.direccion === 'asc' ? comp : -comp;
    });
  }, [rows, busquedaAplicada, orden, estadosSeleccionados]);

  useEffect(() => {
    if (cargando) return;
    setAnuncioAccesible(busquedaAplicada ? `Búsqueda aplicada. ${rowsVisibles.length} registros.` : `Mostrando ${rowsVisibles.length} registros.`);
  }, [busquedaAplicada, rowsVisibles.length, cargando, setAnuncioAccesible]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsVisibles.length) : 0;

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
    <div className="space-y-6">
      <div className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{anuncioAccesible}</div>

      {cargando && (
        <div className={style.loadingOverlay} role="status" aria-live="polite" aria-label="Cargando historial de exportaciones">
          <CircularProgress aria-label="Cargando" />
        </div>
      )}

      <div>
        <LogsHeaderToolbar
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

        {errorReporte && <div className={styles.reportError} role="alert" aria-live="assertive">{errorReporte}</div>}

        <TableContainer className={styles.tabla} component={Paper} elevation={0} square>
          <Table sx={{ minWidth: 650 }} aria-label="Historial de exportaciones de logs">
            <TableHead>
              <TableRow id={styles.subcolumnasLayout}>
                <SortableHeader etiqueta="ID" columna="id" orden={orden} onOrdenar={handleOrdenar} />
                <SortableHeader etiqueta="RANGO DE LOGS" columna="date_range" align="right" orden={orden} onOrdenar={handleOrdenar} />
                <SortableHeader etiqueta="CANTIDAD" columna="count" align="right" orden={orden} onOrdenar={handleOrdenar} />
                <SortableHeader etiqueta="FECHA DE SOLICITUD" columna="created_at" align="right" orden={orden} onOrdenar={handleOrdenar} />
                <TableCell align="right" component="th" scope="col">ESTADO</TableCell>
                <TableCell align="right" component="th" scope="col">ACCIÓN</TableCell>
              </TableRow>
            </TableHead>

            <LogsTableBody
              error={error}
              estadosSeleccionados={estadosSeleccionados}
              rowsVisibles={rowsVisibles}
              rowsPerPage={rowsPerPage}
              page={page}
              emptyRows={emptyRows}
              descargandoId={descargandoId}
              generandoReporteId={generandoReporteId}
              onDownload={handleDownload}
              onGenerarReporte={handleGenerarReporte}
            />

            <TableFooter>
              <TableRow>
                <TablePagination
                  className={styles.paginacion}
                  id={styles.subcolumnasLayout}
                  rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                  colSpan={6}
                  count={rowsVisibles.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count: c }) => `${from}–${to} de ${c !== -1 ? c : `más de ${to}`}`}
                  slotProps={{ select: { inputProps: { 'aria-label': 'Filas por página' }, native: true } }}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>

      <Footer />

      <SpeedDial
        onExportSuccess={handleExportSuccess}
        onDownloadDictionary={handleDownloadLatestDictionary}
      />
    </div>
  );
}
