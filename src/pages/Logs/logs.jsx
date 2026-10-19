import styles from "./logs.module.css";
import style from "../Blacklist/blacklist.module.css";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Estado, { ESTILOS_ESTADO } from "../../components/common/estados";
import SpeedDial from "../../components/common/speedDial";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from "../../components/layout/Navbar";
import CircularProgress from '@mui/material/CircularProgress';
import api from "../../api/client";
import { generarReportePdf } from './reportPdf';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        className={styles.paginationIconButton}
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="Primera página"
      >
        {theme.direction === 'rtl' ? <LastPageIcon aria-hidden="true" /> : <FirstPageIcon aria-hidden="true" />}
      </IconButton>
      <IconButton
        className={styles.paginationIconButton}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="Página anterior"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight aria-hidden="true" /> : <KeyboardArrowLeft aria-hidden="true" />}
      </IconButton>
      <IconButton
        className={styles.paginationIconButton}
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Página siguiente"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft aria-hidden="true" /> : <KeyboardArrowRight aria-hidden="true" />}
      </IconButton>
      <IconButton
        className={styles.paginationIconButton}
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Última página"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon aria-hidden="true" /> : <LastPageIcon aria-hidden="true" />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function TextoAnimado({ texto }) {
  return (
    <p className={styles.textoCelery} aria-label={texto}>
      <span aria-hidden="true">
        {texto.split('').map((caracter, indice) => (
          <span key={`${caracter}-${indice}`} style={{ '--i': indice + 1 }}>
            {caracter === ' ' ? '\u00a0' : caracter}
          </span>
        ))}
      </span>
    </p>
  );
}

const TablaHeaderToolbar = ({
  busqueda,
  onBusquedaChange,
  onBuscar,
  menuFiltrosAbierto,
  estados,
  estadosSeleccionados,
  onAlternarFiltro,
  onCerrarFiltro,
  onAlternarEstado,
  onLimpiar,
  filterButtonRef,
}) => {
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    if (!menuFiltrosAbierto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrarFiltro();
        filterButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(e.target)
      ) {
        onCerrarFiltro();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuFiltrosAbierto, onCerrarFiltro, filterButtonRef]);

  return (
    <Toolbar className={styles.headerBarra} component="header">
      <Typography component="h1" className={styles.titulo}>
        Historial de exportaciones
      </Typography>
      <div className={styles.toolbarActions}>
        <form
          className={styles.searchForm}
          onSubmit={onBuscar}
          role="search"
          aria-label="Búsqueda de exportaciones"
        >
          <label className={styles.srOnly} htmlFor="buscar-registros">
            Buscar por ID, cantidad o fecha
          </label>
          <input
            id="buscar-registros"
            type="search"
            value={busqueda}
            onChange={(event) => onBusquedaChange(event.target.value)}
            placeholder="ID, cantidad o fecha"
            aria-label="Buscar exportaciones por ID, cantidad o fecha"
          />
          {busqueda ? (
            <IconButton
              type="button"
              className={styles.clearSearch}
              onClick={onLimpiar}
              aria-label="Limpiar campo de búsqueda"
            >
              <CloseIcon aria-hidden="true" />
            </IconButton>
          ) : null}
          <button type="submit" className={styles.searchButton}>
            <SearchOutlinedIcon aria-hidden="true" />
            <span>Buscar</span>
          </button>
        </form>
        <div className={styles.filterMenuContainer}>
          <button
            ref={filterButtonRef}
            type="button"
            className={`${styles.filterButton} ${menuFiltrosAbierto ? styles.filterButtonActive : ''}`}
            onClick={onAlternarFiltro}
            aria-expanded={menuFiltrosAbierto}
            aria-controls="filtro-estados-menu"
            aria-haspopup="true"
          >
            <FilterListOutlinedIcon aria-hidden="true" />
            <span>Filtro</span>
          </button>
          {menuFiltrosAbierto ? (
            <div
              ref={menuRef}
              id="filtro-estados-menu"
              className={styles.filterMenu}
              role="region"
              aria-label="Opciones de filtro por estado"
            >
              <fieldset className={styles.filterFieldset}>
                <legend className={styles.filterLegend}>Filtrar por estado</legend>
                {estados.map((estado) => {
                  const colores = ESTILOS_ESTADO[estado] || { borde: '#3B4655', fondo: '#1B212B', color: '#E3EAF1' };
                  const seleccionado = estadosSeleccionados.includes(estado);

                  return (
                    <label className={styles.filterOption} key={estado}>
                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() => onAlternarEstado(estado)}
                        aria-label={`Filtrar estado ${estado}`}
                      />
                      <span
                        className={styles.statusCheck}
                        style={{ '--estado-borde': colores.borde, '--estado-fondo': colores.fondo, '--estado-check': colores.color }}
                        aria-hidden="true"
                      >
                        {seleccionado ? '✓' : ''}
                      </span>
                      <span>{estado}</span>
                    </label>
                  );
                })}
              </fieldset>
            </div>
          ) : null}
        </div>
      </div>
    </Toolbar>
  );
};

function SortableHeader({ etiqueta, columna, align = 'left', orden, onOrdenar }) {
  const activa = orden.columna === columna;
  const descendente = activa && orden.direccion === 'desc';
  const ordenTexto = activa ? (descendente ? 'descendente' : 'ascendente') : 'sin ordenar';
  const accionSiguiente = activa && !descendente ? 'descendente' : 'ascendente';

  return (
    <TableCell
      component="th"
      scope="col"
      align={align}
      aria-sort={activa ? (descendente ? 'descending' : 'ascending') : 'none'}
    >
      <button
        type="button"
        className={`${styles.sortButton} ${align === 'right' ? styles.sortButtonRight : ''} ${activa ? styles.sortButtonActive : ''}`}
        onClick={() => onOrdenar(columna)}
        aria-label={`Ordenar por ${etiqueta}. Orden actual: ${ordenTexto}. Presione para ordenar ${accionSiguiente}`}
      >
        <span>{etiqueta}</span>
        <ArrowDownwardIcon
          className={`${styles.sortIcon} ${activa && !descendente ? styles.sortIconAsc : ''}`}
          aria-hidden="true"
        />
      </button>
    </TableCell>
  );
}

const MESES_MAP = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

function parseFechaSolicitud(fechaStr) {
  if (!fechaStr) return 0;
  const isoTime = new Date(fechaStr).getTime();
  if (!isNaN(isoTime)) return isoTime;

  const regex = /(\d{1,2})\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚ]+)\s+de\s+(\d{4}),?\s+(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?)?/i;
  const match = String(fechaStr).toLowerCase().match(regex);
  if (!match) return 0;

  const dia = parseInt(match[1], 10);
  const mesNombre = match[2];
  const anio = parseInt(match[3], 10);
  let hora = parseInt(match[4], 10);
  const minuto = parseInt(match[5], 10);
  const ampm = match[6];

  const mes = MESES_MAP[mesNombre] ?? -1;
  if (mes === -1) return 0;

  if (ampm) {
    const esPM = ampm.startsWith('p');
    if (esPM && hora < 12) hora += 12;
    if (!esPM && hora === 12) hora = 0;
  }

  return new Date(anio, mes, dia, hora, minuto).getTime();
}

export default function Logs() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [menuFiltrosAbierto, setMenuFiltrosAbierto] = React.useState(false);
  const [busqueda, setBusqueda] = React.useState('');
  const [busquedaAplicada, setBusquedaAplicada] = React.useState('');
  const [orden, setOrden] = React.useState({ columna: null, direccion: 'asc' });
  const [estadosSeleccionados, setEstadosSeleccionados] = React.useState([]);
  const [descargandoId, setDescargandoId] = React.useState(null);
  const [generandoReporteId, setGenerandoReporteId] = React.useState(null);
  const [errorReporte, setErrorReporte] = React.useState('');
  const [anuncioAccesible, setAnuncioAccesible] = React.useState('');

  const filterButtonRef = React.useRef(null);

  const estados = React.useMemo(() => [...new Set(rows.map((row) => row.status))], [rows]);

  const rowsVisibles = React.useMemo(() => {
    const termino = busquedaAplicada.trim().toLowerCase();
    const filtradas = rows.filter((row) => {
      const coincideBusqueda = !termino || [row.id, row.count, row.created_at]
        .some((valor) => String(valor).toLowerCase().includes(termino));
      const coincideEstado = estadosSeleccionados.includes(row.status);

      return coincideBusqueda && coincideEstado;
    });

    if (!orden.columna) {
      return filtradas;
    }

    return [...filtradas].sort((a, b) => {
      let comparacion;

      if (orden.columna === 'count') {
        comparacion = Number(a.count) - Number(b.count);
      } else if (orden.columna === 'created_at') {
        comparacion = parseFechaSolicitud(a.created_at) - parseFechaSolicitud(b.created_at);
      } else {
        comparacion = String(a[orden.columna]).localeCompare(String(b[orden.columna]), undefined, { numeric: true });
      }

      return orden.direccion === 'asc' ? comparacion : -comparacion;
    });
  }, [rows, busquedaAplicada, orden, estadosSeleccionados]);

  // Actualizar anuncios en vivo para tecnologías de asistencia
  React.useEffect(() => {
    if (cargando) return;
    if (busquedaAplicada) {
      setAnuncioAccesible(`Búsqueda aplicada. ${rowsVisibles.length} registros encontrados.`);
    } else {
      setAnuncioAccesible(`Mostrando ${rowsVisibles.length} registros.`);
    }
  }, [busquedaAplicada, rowsVisibles.length, cargando]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsVisibles.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuscar = (event) => {
    event.preventDefault();
    setBusquedaAplicada(busqueda);
    setPage(0);
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setBusquedaAplicada('');
    setPage(0);
    setAnuncioAccesible('Búsqueda restablecida.');
  };

  const handleOrdenar = (columna) => {
    setOrden((ordenActual) => {
      const nuevaDireccion = ordenActual.columna === columna && ordenActual.direccion === 'asc' ? 'desc' : 'asc';
      setAnuncioAccesible(`Tabla ordenada por ${columna} en modo ${nuevaDireccion}.`);
      return {
        columna,
        direccion: nuevaDireccion,
      };
    });
    setPage(0);
  };

  const handleAlternarEstado = (estado) => {
    setEstadosSeleccionados((seleccionados) => {
      const nuevos = seleccionados.includes(estado)
        ? seleccionados.filter((estadoSeleccionado) => estadoSeleccionado !== estado)
        : [...seleccionados, estado];
      return nuevos;
    });
    setPage(0);
  };

  const handleDownload = async (exportId) => {
    try {
      setDescargandoId(exportId);
      setAnuncioAccesible(`Descargando archivo de exportación ${exportId}...`);
      const response = await api.get(`/logs/download/${exportId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exportId}.jsonl`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setAnuncioAccesible(`Descarga de exportación ${exportId} completada.`);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
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
    } catch (error) {
      console.error('Error al generar el reporte PDF:', error);
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

  function CreateButtons({ texto, exportId }) {
    if (texto === "Listo") {
      return (
        <div className={styles.botonesAccion}>
          <button
            type="button"
            className={styles.botonDescarga}
            onClick={() => handleDownload(exportId)}
            disabled={descargandoId === exportId}
            aria-label={`Descargar exportación ${exportId}`}
          >
            <FileDownloadOutlinedIcon aria-hidden="true" />
            <span className={styles.srOnly}>Descargar archivo de exportación {exportId}</span>
          </button>
          <button
            type="button"
            className={styles.botonPdf}
            onClick={() => handleGenerarReporte(exportId)}
            disabled={generandoReporteId === exportId}
            aria-label={`Generar reporte PDF de exportación ${exportId}`}
          >
            <TextSnippetOutlinedIcon className={styles.iconoPdf} aria-hidden="true" />
            <span className={styles.srOnly}>Generar reporte PDF de exportación {exportId}</span>
          </button>
        </div>
      );
    } else if (texto === "Pendiente de Aprobación") {
      return (
        <div className={styles.botonesAccion} id={styles.telegramContainer} role="status">
          <ScheduleSendOutlinedIcon className={styles.iconoSend} aria-hidden="true" />
          <p className={styles.textoTelegram}>Esperando Telegram</p>
        </div>
      );
    } else if (texto === "Procesando") {
      return (
        <div role="status">
          <TextoAnimado texto="En cola Celery ..." />
        </div>
      );
    } else if (texto === "Rechazada") {
      return (
        <span className={styles.sinAcciones} aria-label="Sin acciones disponibles">—</span>
      );
    } else {
      return null;
    }
  }

  const cargarLogs = React.useCallback(async (mostrarLoading = true) => {
    try {
      if (mostrarLoading) setCargando(true);
      setError('');

      const respuesta = await api.get('/logs/history');
      setRows(respuesta.data);
      setEstadosSeleccionados((prev) => {
        const nuevos = [...new Set(respuesta.data.map((row) => row.status))];
        return prev.length === 0 ? nuevos : Array.from(new Set([...prev, ...nuevos]));
      });
    } catch (err) {
      setError('No fue posible cargar el historial de exportaciones.');
    } finally {
      if (mostrarLoading) setCargando(false);
    }
  }, []);

  React.useEffect(() => {
    cargarLogs();
  }, [cargarLogs]);

  // Polling automático (PB-HM-38: "La tabla se actualiza automáticamente cada 10 segundos")
  // Con polling acelerado (3s) si hay alguna tarea en estado "Procesando"
  React.useEffect(() => {
    const hayEnProceso = rows.some((row) => row.status === 'Procesando');
    const intervaloMs = hayEnProceso ? 3000 : 10000;

    const intervalo = setInterval(() => {
      cargarLogs(false);
    }, intervaloMs);

    return () => clearInterval(intervalo);
  }, [rows, cargarLogs]);

  const handleExportSuccess = (nuevoRegistro) => {
    setPage(0);
    if (nuevoRegistro) {
      setRows((prev) => {
        const existe = prev.some((r) => r.id === nuevoRegistro.id);
        if (existe) return prev;
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
      setEstadosSeleccionados((prev) => Array.from(new Set([...prev, nuevoRegistro.status])));
    }
    cargarLogs(false);
    setAnuncioAccesible('Nueva exportación solicitada. La lista ha sido actualizada.');
  };

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        Saltar al contenido principal
      </a>

      {/* Región ARIA Live para anuncios accesibles dinámicos */}
      <div className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {anuncioAccesible}
      </div>

      {cargando ? (
        <div className={style.loadingOverlay} role="status" aria-live="polite" aria-label="Cargando historial de exportaciones">
          <CircularProgress aria-label="Cargando" />
        </div>
      ) : null}

      <Navbar />

      <main id="main-content" className={styles.mainContainer} tabIndex="-1">
        <TablaHeaderToolbar
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          onBuscar={handleBuscar}
          menuFiltrosAbierto={menuFiltrosAbierto}
          estados={estados}
          estadosSeleccionados={estadosSeleccionados}
          onAlternarFiltro={() => setMenuFiltrosAbierto((abierto) => !abierto)}
          onCerrarFiltro={() => setMenuFiltrosAbierto(false)}
          onAlternarEstado={handleAlternarEstado}
          onLimpiar={handleLimpiarBusqueda}
          filterButtonRef={filterButtonRef}
        />

        {errorReporte ? (
          <div className={styles.reportError} role="alert" aria-live="assertive">
            {errorReporte}
          </div>
        ) : null}

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
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell className={styles.errorCell} colSpan={6}>
                    <p className={styles.errorText} role="alert" aria-live="assertive">
                      {error}
                    </p>
                  </TableCell>
                </TableRow>
              ) : !estadosSeleccionados.length ? (
                <TableRow id={styles.tuplas}>
                  <TableCell className={styles.emptyFilterCell} colSpan={6}>
                    <div role="status" aria-live="polite">
                      <TextoAnimado texto="Aplique al menos un filtro." />
                    </div>
                  </TableCell>
                </TableRow>
              ) : rowsVisibles.length === 0 ? (
                <TableRow id={styles.tuplas}>
                  <TableCell className={styles.emptyFilterCell} colSpan={6}>
                    <p className={styles.textoVacio} role="status" aria-live="polite">
                      No se encontraron exportaciones que coincidan con los filtros aplicados.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                (rowsPerPage > 0
                  ? rowsVisibles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : rowsVisibles
                ).map((row) => (
                  <TableRow
                    id={styles.tuplas}
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{row.id}</TableCell>
                    <TableCell className={styles.rangoCell} align="right">{row.date_range}</TableCell>
                    <TableCell className={styles.ctfcCell} align="right">{row.count}</TableCell>
                    <TableCell className={styles.ctfcCell} align="right">{row.created_at}</TableCell>
                    <TableCell align="right"><Estado texto={row.status} /></TableCell>
                    <TableCell align="right"><CreateButtons texto={row.status} exportId={row.id} /></TableCell>
                  </TableRow>
                ))
              )}
              {emptyRows > 0 && (
                <TableRow className={styles.filaVacia} style={{ height: 53 * emptyRows }}>
                  <TableCell className={styles.celdaVacia} colSpan={6} aria-hidden="true" />
                </TableRow>
              )}
            </TableBody>
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
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                  slotProps={{
                    select: {
                      inputProps: {
                        'aria-label': 'Filas por página',
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </main>

      <SpeedDial
        onExportSuccess={handleExportSuccess}
        onDownloadDictionary={handleDownloadLatestDictionary}
      />
    </>
  );
}
