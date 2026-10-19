import styles from "./logs.module.css"
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
import Estado from "../../components/common/estados";
import SpeedDial from "../../components/common/speedDial";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Navbar from "../../components/layout/Navbar";
import { getLogsHistory, downloadLogExport } from "../../api/logsApi";
import { generateDictionaryPDF } from "../../utils/PdfGenerator";



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


function createData(id, rangelogs, cuantity, date_request, state, action) {
  return {id, rangelogs, cuantity, date_request, state, action};
}


function CreateButtons({ row, texto }) {
  const [downloading, setDownloading] = React.useState(false);
  const [generatingPdf, setGeneratingPdf] = React.useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadLogExport(row.id);
    } catch (e) {
      console.error("Error al descargar archivo de logs:", e);
      alert("No se pudo descargar el archivo JSONL: " + (e.response?.data?.detail || e.message));
    } finally {
      setDownloading(false);
    }
  };

  const handlePdf = async () => {
    try {
      setGeneratingPdf(true);
      await generateDictionaryPDF(row);
    } catch (e) {
      console.error("Error al generar PDF:", e);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (texto === "Listo") {
    return (
      <div className={styles.botonesAccion}>
        <button
          type="button"
          className={styles.botonDescarga}
          title="Descargar archivo JSONL de logs"
          aria-label={`Descargar logs para ${row.id}`}
          onClick={handleDownload}
          disabled={downloading}
        >
          <FileDownloadOutlinedIcon />
        </button>
        <button
          type="button"
          className={styles.botonPdf}
          title="Descargar Esquema Canónico en PDF"
          aria-label={`Descargar PDF para ${row.id}`}
          onClick={handlePdf}
          disabled={generatingPdf}
        >
          <TextSnippetOutlinedIcon className={styles.iconoPdf} />
        </button>
      </div>
    );
  } else if (texto === "Pendiente" || texto === "Pendiente de Aprobación") {
    return (
      <div className={styles.botonesAccion} id={styles.telegramContainer}>
        <ScheduleSendOutlinedIcon className={styles.iconoSend} />
        <p className={styles.textoTelegram}>Esperando Telegram</p>
      </div>
    );
  } else if (texto === "Procesando") {
    return (
      <p className={styles.textoCelery}>
        <span style={{ "--i": 1 }}>E</span>
        <span style={{ "--i": 2 }}>n</span>
        <span style={{ "--i": 3 }}>&nbsp;</span>
        <span style={{ "--i": 4 }}>c</span>
        <span style={{ "--i": 5 }}>o</span>
        <span style={{ "--i": 6 }}>l</span>
        <span style={{ "--i": 7 }}>a</span>
        <span style={{ "--i": 8 }}>&nbsp;</span>
        <span style={{ "--i": 9 }}>C</span>
        <span style={{ "--i": 10 }}>e</span>
        <span style={{ "--i": 11 }}>l</span>
        <span style={{ "--i": 12 }}>e</span>
        <span style={{ "--i": 13 }}>r</span>
        <span style={{ "--i": 14 }}>y</span>
        <span style={{ "--i": 15 }}>&nbsp;</span>
        <span style={{ "--i": 16 }}>.</span>
        <span style={{ "--i": 17 }}>.</span>
        <span style={{ "--i": 18 }}>.</span>
      </p>
    );
  } else if (texto === "Rechazada") {
    return <p style={{ color: "#b4b4b4" }}>-</p>;
  } else {
    return null;
  }
}

const TablaHeaderToolbar = () => {
  return (
    <Toolbar className={styles.headerBarra}>
      <Typography className={styles.titulo}>Historial de exportaciones</Typography>
    </Toolbar>
  );
};

const initialRows = [
  createData("EXP-1045", "2026-08-19 / 2026-08-20", 21660, "20 de agosto de 2026, 11:34 a.m.", "Listo"),
  createData("EXP-1044", "2026-08-01 / 2026-08-25", 112450, "25 de agosto de 2026, 9:15 a.m.", "Pendiente de Aprobación"),
  createData("EXP-1043", "2026-08-16 / 2026-08-16", 840, "16 de agosto de 2026, 4:21 p.m.", "Procesando"),
  createData("EXP-1042", "2026-07-01 / 2026-07-31", 145200, "31 de julio de 2026, 2:00 p.m.", "Rechazada"),
];

export default function logs() {
  const [rows, setRows] = React.useState(initialRows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchHistory() {
      try {
        const data = await getLogsHistory();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) =>
            createData(
              item.id,
              item.date_range,
              item.count,
              item.created_at,
              item.status
            )
          );
          setRows(mapped);
        }
      } catch (err) {
        console.warn("No se pudo obtener historial de logs del backend, conservando referencias:", err);
      }
    }
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Navbar />
      <TablaHeaderToolbar />
      <TableContainer className={styles.tabla} component={Paper} elevation={0} square>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow id={styles.subcolumnasLayout}>
              <TableCell>ID</TableCell>
              <TableCell align="right">RANGO DE LOGS</TableCell>
              <TableCell align="right">CANTIDAD</TableCell>
              <TableCell align="right">FECHA DE SOLICITUD</TableCell>
              <TableCell align="right">ESTADO</TableCell>
              <TableCell align="right">ACCIÓN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
              (row) => (
                <TableRow
                  id={styles.tuplas}
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell component="rango" align="right">
                    {row.rangelogs}
                  </TableCell>
                  <TableCell component="ctfc" align="right">
                    {typeof row.cuantity === "number" ? row.cuantity.toLocaleString("es-ES") : row.cuantity}
                  </TableCell>
                  <TableCell component="ctfc" align="right">
                    {row.date_request}
                  </TableCell>
                  <TableCell align="right">
                    <Estado texto={row.state} />
                  </TableCell>
                  <TableCell align="right">
                    <CreateButtons row={row} texto={row.state} />
                  </TableCell>
                </TableRow>
              )
            )}

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
              count={rows.length}
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
    <SpeedDial/>
    </>
  );
}