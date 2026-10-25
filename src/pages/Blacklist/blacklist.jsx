import * as React from 'react';
import api from '../../api/client';
import PropTypes from 'prop-types';
import styles from "./blacklist.module.css"
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { BorderLinearProgress } from '../../components/common/linearProgress';
import Estado from '../../components/common/estados';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Navbar from '../../components/layout/Navbar';




function getIpType(ip) {
  if (typeof ip !== 'string') {
    return null;
  }

  const ipv4Parts = ip.split('.');
  if (
    ipv4Parts.length === 4 &&
    ipv4Parts.every((part) => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255)
  ) {
    return 'IPv4';
  }

  const compressionCount = (ip.match(/::/g) || []).length;
  const ipv6Parts = ip.split(':');
  const hextets = ipv6Parts.filter(Boolean);
  if (
    compressionCount <= 1 &&
    hextets.length <= 8 &&
    (compressionCount === 1 || hextets.length === 8) &&
    hextets.every((part) => /^[0-9a-fA-F]{1,4}$/.test(part))
  ) {
    return 'IPv6';
  }

  return null;
}

function createData({ ip, country, category, threat_score }) {
  const ipType = getIpType(ip);
  if (!ipType) {
    throw new Error(`IP inválida: ${ip}. Solo se permiten IPv4 o IPv6.`);
  }

  return { ip, ipType, country, category, threat_score };
}

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(event) => onPageChange(event, 0)} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={(event) => onPageChange(event, page - 1)} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={(event) => onPageChange(event, page + 1)} disabled={page >= lastPage} aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={(event) => onPageChange(event, lastPage)} disabled={page >= lastPage} aria-label="last page">
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

export default function Blacklist() {
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [cargando, setCargando] = React.useState(true);
    const [error, setError] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [modalAbierto, setModalAbierto] = React.useState(false);
    const [modalCerrando, setModalCerrando] = React.useState(false);
    const [modalVersion, setModalVersion] = React.useState(0);
    const [threatScore, setThreatScore] = React.useState(0);
    const [category, setCategory] = React.useState('');
    const categoryOptions = [...new Set(rows.map((row) => row.category))];



    const añadirAmenaza = async () => {
      try {
        const datosAmenaza = {
          ip: {},
          ip_type: a,
          country: a,
          threat_score: a,
          category: a,
          notes: "string"
        }
      } catch (error) {
        
      }
    }
    React.useEffect(() => {
      async function cargarBlacklist() {
        try {
          setCargando(true);
          setError('');

          const respuesta = await api.get('/blacklist/');

          setRows(respuesta.data);
        } catch (err) {
          setError('No fue posible cargar la blacklist.');
        } finally {
          setCargando(false);
        }
      }
      cargarBlacklist();
    }, []);

    const abrirModal = () => {
      setModalCerrando(false);
      setModalVersion((version) => version + 1);
      setModalAbierto(true);
    };

    const cerrarModal = () => {
      setModalCerrando(true);
      window.setTimeout(() => {
        setModalAbierto(false);
        setModalCerrando(false);
      }, 300);
    };
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleSubmit = (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      const ip = form.ip.value.trim();
      const country = form.country.value.trim();

      if (!getIpType(ip)) {
        form.ip.setCustomValidity('Introduce una dirección IPv4 o IPv6 válida.');
        form.ip.reportValidity();
        return;
      }

      form.ip.setCustomValidity('');
      setRows((currentRows) => [
        createData({
          ip: ip,
          country,
          category,
          threat_score: threatScore,
        }),
        ...currentRows,
      ]);
      setThreatScore(0);
      setCategory('');
      form.reset();
      cerrarModal();
    };
  

  return (
    <>
    <Navbar/>
    {cargando ? (
      <div className={styles.loadingOverlay} role="status" aria-label="Cargando blacklist">
        <CircularProgress aria-label="Cargando" />
      </div>
    ) : null}

    <div className={styles.encabezado}>
      <div className={styles.tituloFila}>
        <GppMaybeOutlinedIcon className={styles.tituloIcono}/>
        <h1>Threat Intelligence Center</h1>
      </div>
      <p>Gestión y análisis de indicadores de compromiso (IoC).</p>
    </div>
    <TableContainer className={styles.tabla} component={Paper} elevation={0} square>
      <Table sx={{ minWidth: 650, width: '100%', tableLayout: 'fixed' }} aria-label="simple table">
        <TableHead>
          <TableRow id={styles.subcolumnasLayout}>
            <TableCell>IP / TIPO</TableCell>
            <TableCell>PAÍS</TableCell>
            <TableCell>CATEGORIA</TableCell>
            <TableCell className={styles.threatScoreCell}>THREAT SCORE</TableCell>
            <TableCell className={styles.estadoCell}>ESTADO</TableCell>
            <TableCell className={styles.accionesHeader}>ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {error ? (
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
          ) : (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): rows)
          .map((row) => (
            <TableRow id={styles.tuplas}
              key={row.ip}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" className={styles.ipCell}>
                <span>
                  {row.ip.split(':').map((parte, indice, partes) => (
                    <React.Fragment key={`${parte}-${indice}`}>
                      {parte}
                      {indice < partes.length - 1 ? <>{':'}<wbr /></> : null}
                    </React.Fragment>
                  ))}
                </span>
                <small>{row.ip_type}</small>
              </TableCell>
              <TableCell component="ths">{row.country}</TableCell>
              <TableCell component="ths">{row.category}</TableCell>
              <TableCell component="ths" className={styles.threatScoreCell}>
                <div className={styles.threatScoreBar}>
                  <span className={row.threat_score <= 70 ? styles.threatScoreSafe : styles.threatScoreDanger}>
                    {row.threat_score}
                  </span>
                  <BorderLinearProgress
                    variant="determinate"
                    value={row.threat_score}
                    sx={{
                      backgroundColor: '#2A3440 !important',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: row.threat_score <= 70 ? '#B89A2E' : '#b30c00',
                      },
                    }}
                  />
                </div>
              </TableCell>
              <TableCell component="ths" className={styles.estadoCell}>
                <Estado texto={row.status} mostrarIcono={false} />
              </TableCell>
              <TableCell component="ths" className={styles.accionesCell}>
                <div className={styles.accionesBotones}>
                  <IconButton className={styles.editarButton} aria-label="editar registro">
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton className={styles.eliminarButton} aria-label="eliminar registro">
                    <DeleteForeverOutlinedIcon />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow className={styles.celdaVacia} style={{ height: 53 * emptyRows }}>
              <TableCell className={styles.celdaVacia} colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter >
          <TableRow>
            <TablePagination className={styles.paginacion} id={styles.subcolumnasLayout}
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={6}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  MenuProps: {
                    PaperProps: {
                      className: styles.rowsPerPageMenu,
                    },
                  },
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
    {rowsPerPage > 5 ? (
      <button type="button" className={styles.anadirAmenaza} aria-label="añadir amenazas" onClick={abrirModal}>
        +
      </button>
    ) : (
      <button type="button" className={styles.anadirAmenazaTexto} onClick={abrirModal}>
        + Añadir amenaza
      </button>
    )}
    <Modal open={modalAbierto} keepMounted onClose={cerrarModal}>
      <div key={modalVersion} className={`${styles.modalAmenaza} ${modalCerrando ? styles.modalAmenazaSalida : styles.modalAmenazaEntrada}`}>
        <h2 className={styles.tituloModal}>Nueva amenaza</h2>
        <IconButton className={styles.cerrarModal} aria-label="cerrar modal" onClick={cerrarModal}>
          <CloseIcon />
        </IconButton>
        <form id="amenaza-form" onSubmit={handleSubmit}>

      
          <label className={styles.ipLabel} htmlFor="ip">Dirección IP:</label>
          <br />
          <input 
            id="ip"
            name="ip"
            type="text"
            required
            autoComplete="off"
            placeholder="Ej. 192.160.10.1"
            onInput={(event) => event.currentTarget.setCustomValidity('')}
          />
          <br />
          <label className={styles.paisLabel} htmlFor="country">País</label>
          <br />
          <input
            id="country"
            name="country"
            required
            type="text"
            placeholder="Ej. Japón"
          />

          <div className={styles.threatScoreForm}>
            <div className={styles.threatScoreFormLabel}>
              <p>Threat score:</p>
              <input
                type="number"
                min="0"
                max="100"
                value={threatScore}
                onChange={(event) => {
                  const value = Math.min(100, Math.max(0, Number(event.target.value)));
                  setThreatScore(value);
                }}
                aria-label="valor del threat score"
              />
            </div>
            <Slider
              value={threatScore}
              min={0}
              max={100}
              onChange={(_, value) => setThreatScore(value)}
              aria-label="threat score"
              className={styles.threatScoreSlider}
            />
          </div>

          <br />
          <label className={styles.categoriaLabel} htmlFor="category">Categoría</label>
          <br />
          <Select
            id="category"
            name="category"
            value={category}
            required
            displayEmpty
            onChange={(event) => setCategory(event.target.value)}
            className={styles.categorySelect}
            inputProps={{ 'aria-label': 'categoría' }}
          >
            <MenuItem value="" disabled className={styles.categoryPlaceholder}>
              Selecciona una categoría
            </MenuItem>
            {categoryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          

        </form>
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelarModal} onClick={cerrarModal}>
            Cancelar
          </button>
          <button type="submit" form="amenaza-form" className={`${styles.anadirAmenazaTexto} ${styles.guardarModal}`}>
            Guardar
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
}