import styles from "./logs.module.css"
import style from "../Blacklist/blacklist.module.css"
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
      <IconButton style={{color: '#959DA7'}}
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton style={{color: '#959DA7'}}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton style={{color: '#959DA7'}}
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton style={{color: '#959DA7'}}
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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
    <p className={styles.textoCelery}>
      {texto.split('').map((caracter, indice) => (
        <span key={`${caracter}-${indice}`} style={{ '--i': indice + 1 }}>
          {caracter === ' ' ? '\u00a0' : caracter}
        </span>
      ))}
    </p>
  );
}

const TablaHeaderToolbar = ({ busqueda, onBusquedaChange, onBuscar, menuFiltrosAbierto, estados, estadosSeleccionados, onAlternarFiltro, onAlternarEstado, onLimpiar }) =>  {
    return(
        <Toolbar className={styles.headerBarra}>
            <Typography className={styles.titulo}>
                Historial de exportaciones
            </Typography>
            <div className={styles.toolbarActions}>
              <form className={styles.searchForm} onSubmit={onBuscar}>
                <label className={styles.srOnly} htmlFor="buscar-registros">Buscar por ID, cantidad o fecha</label>
                <input
                  id="buscar-registros"
                  value={busqueda}
                  onChange={(event) => onBusquedaChange(event.target.value)}
                  placeholder="ID, cantidad o fecha"
                />
                {busqueda ? (
                  <IconButton type="button" className={styles.clearSearch} onClick={onLimpiar} aria-label="limpiar búsqueda">
                    <CloseIcon />
                  </IconButton>
                ) : null}
                <button type="submit" className={styles.searchButton} aria-label="buscar registros">
                  <SearchOutlinedIcon />
                  Buscar
                </button>
              </form>
              <div className={styles.filterMenuContainer}>
                <button
                  type="button"
                  className={`${styles.filterButton} ${menuFiltrosAbierto ? styles.filterButtonActive : ''}`}
                  onClick={onAlternarFiltro}
                  aria-expanded={menuFiltrosAbierto}
                  aria-controls="filtro-estados"
                >
                  <FilterListOutlinedIcon />
                  Filtro
                </button>
                {menuFiltrosAbierto ? (
                  <div id="filtro-estados" className={styles.filterMenu}>
                    <p>Filtrar por estado</p>
                    {estados.map((estado) => {
                      const colores = ESTILOS_ESTADO[estado] || { borde: '#3B4655', fondo: '#1B212B', color: '#E3EAF1' };
                      const seleccionado = estadosSeleccionados.includes(estado);

                      return (
                        <label className={styles.filterOption} key={estado}>
                          <input
                            type="checkbox"
                            checked={seleccionado}
                            onChange={() => onAlternarEstado(estado)}
                          />
                          <span
                            className={styles.statusCheck}
                            style={{ '--estado-borde': colores.borde, '--estado-fondo': colores.fondo, '--estado-check': colores.color }}
                            aria-hidden="true"
                          >
                            {seleccionado ? '✓' : ''}
                          </span>
                          {estado}
                        </label>
                      );
                    })}
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

  return (
    <TableCell align={align} aria-sort={activa ? (descendente ? 'descending' : 'ascending') : 'none'}>
      <button
        type="button"
        className={`${styles.sortButton} ${align === 'right' ? styles.sortButtonRight : ''} ${activa ? styles.sortButtonActive : ''}`}
        onClick={() => onOrdenar(columna)}
      >
        <span>{etiqueta}</span>
        <ArrowDownwardIcon className={`${styles.sortIcon} ${activa && !descendente ? styles.sortIconAsc : ''}`} />
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

export default function logs() {
  const [rows, setRows] = React.useState(initialRows);
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

  // Avoid a layout jump when reaching the last page with empty rows.
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
  };

  const handleOrdenar = (columna) => {
    setOrden((ordenActual) => ({
      columna,
      direccion: ordenActual.columna === columna && ordenActual.direccion === 'asc' ? 'desc' : 'asc',
    }));
    setPage(0);
  };

  const handleAlternarEstado = (estado) => {
    setEstadosSeleccionados((seleccionados) => (
      seleccionados.includes(estado)
        ? seleccionados.filter((estadoSeleccionado) => estadoSeleccionado !== estado)
        : [...seleccionados, estado]
    ));
    setPage(0);
  };

  const handleDownload = async (exportId) => {
    try {
      setDescargandoId(exportId);
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
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    } finally {
      setDescargandoId(null);
    }
  };

  const handleGenerarReporte = async (exportId) => {
    try {
      setErrorReporte('');
      setGenerandoReporteId(exportId);
      const respuesta = await api.get(`/logs/report-stats/${exportId}`);
      await generarReportePdf(exportId, respuesta.data);
    } catch (error) {
      console.error('Error al generar el reporte PDF:', error);
      setErrorReporte('No fue posible generar el PDF. Verifica que la exportación esté lista e inténtalo nuevamente.');
    } finally {
      setGenerandoReporteId(null);
    }
  };

  function CreateButtons ({texto, exportId}){
    if (texto === "Listo"){
      return (
        <div className={styles.botonesAccion}>
          <button
            type="button"
            className={styles.botonDescarga}
            onClick={() => handleDownload(exportId)}
            disabled={descargandoId === exportId}
            aria-label={`Descargar exportación ${exportId}`}
          >
            <FileDownloadOutlinedIcon/>
          </button>
          <button
            type="button"
            className={styles.botonPdf}
            onClick={() => handleGenerarReporte(exportId)}
            disabled={generandoReporteId === exportId}
            aria-label={`Generar reporte PDF de ${exportId}`}
          >
            <TextSnippetOutlinedIcon className={styles.iconoPdf}/>
          </button>
        </div>
      );
    }else if (texto == "Pendiente de Aprobación"){
      return(
        <div className={styles.botonesAccion} id={styles.telegramContainer}>
          <ScheduleSendOutlinedIcon className={styles.iconoSend}/>
          <p className={styles.textoTelegram}>Esperando Telegram</p>
        </div>
      )
    }else if (texto == "Procesando"){
      return(
        <TextoAnimado texto="En cola Celery ..." />
      );
    }else if(texto == "Rechazada"){
      return(
        <p style={{color: '#b4b4b4'}}>-</p>
      );
    }else{
      return null;
    }
  }

  const cargarLogs = React.useCallback(async (mostrarLoading = true) => {
    try {
      if (mostrarLoading) setCargando(true);
      setError('');

      const respuesta = await api.get('/logs/history');
      setRows(respuesta.data);
      setEstadosSeleccionados([...new Set(respuesta.data.map((row) => row.status))]);
    } catch (err) {
      setError('No fue posible cargar el historial de logs.');
    } finally {
      if (mostrarLoading) setCargando(false);
    }
  }, []);

  React.useEffect(() => {
    cargarLogs();
  }, [cargarLogs]);

  const handleExportSuccess = () => {
    setPage(0);
    cargarLogs(false);
  };



  return (
    <>
    {cargando ? (
          <div className={style.loadingOverlay} role="status" aria-label="Cargando blacklist">
            <CircularProgress aria-label="Cargando" />
          </div>
        ) : null}
    <Navbar/>
    <TablaHeaderToolbar
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      onBuscar={handleBuscar}
      menuFiltrosAbierto={menuFiltrosAbierto}
      estados={estados}
      estadosSeleccionados={estadosSeleccionados}
      onAlternarFiltro={() => setMenuFiltrosAbierto((abierto) => !abierto)}
      onAlternarEstado={handleAlternarEstado}
      onLimpiar={handleLimpiarBusqueda}
    />
    {errorReporte ? <p className={styles.reportError} role="alert">{errorReporte}</p> : null}
    <TableContainer className={styles.tabla} component={Paper} elevation={0} square>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow id={styles.subcolumnasLayout}>
            <SortableHeader etiqueta="ID" columna="id" orden={orden} onOrdenar={handleOrdenar} />
            <SortableHeader etiqueta="RANGO DE LOGS" columna="date_range" align="right" orden={orden} onOrdenar={handleOrdenar} />
            <SortableHeader etiqueta="CANTIDAD" columna="count" align="right" orden={orden} onOrdenar={handleOrdenar} />
            <SortableHeader etiqueta="FECHA DE SOLICITUD" columna="created_at" align="right" orden={orden} onOrdenar={handleOrdenar} />
            <TableCell align="right">ESTADO</TableCell>
            <TableCell align="right">ACCIÓN</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {error ? 
          (
            <TableRow>
              <TableCell className={styles.errorCell} colSpan={6}>
                <p className={styles.errorText} role="alert">
                  {'No fue posible cargar las IPs de la blacklist.'.split('').map((caracter, indice) => (
                    <span key={`${caracter}-${indice}`} style={{ '--i': indice + 1 }}>
                      {caracter === ' ' ? '\u00a0' : caracter}
                    </span>
                  ))}
                </p>
              </TableCell>
            </TableRow>
          )
          :
          !estadosSeleccionados.length ? (
            <TableRow id={styles.tuplas}>
              <TableCell className={styles.emptyFilterCell} colSpan={6}>
                <TextoAnimado texto="Aplique al menos un filtro." />
              </TableCell>
            </TableRow>
          ) :
          (rowsPerPage > 0 ? rowsVisibles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): rowsVisibles)
          .map((row) => (
            <TableRow id={styles.tuplas}
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{row.id}</TableCell>
              <TableCell component="rango" align="right">{row.date_range}</TableCell>
              <TableCell component="ctfc" align="right">{row.count}</TableCell>
              <TableCell component="ctfc" align="right">{row.created_at}</TableCell>
              <TableCell align="right"><Estado texto={row.status}/></TableCell>
              <TableCell align="right"><CreateButtons texto={row.status} exportId={row.id}/></TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow className={styles.filaVacia} style={{ height: 53 * emptyRows }}>
              <TableCell className={styles.celdaVacia} colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter >
          <TableRow>
            <TablePagination className={styles.paginacion} id={styles.subcolumnasLayout}
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={6}
              count={rowsVisibles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
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
    <SpeedDial onExportSuccess={handleExportSuccess}/>
    </>
  );
}
