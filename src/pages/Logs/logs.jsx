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
import Estado from "../../components/common/estadoLogs";
import SpeedDial from "../../components/common/speedDial";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';



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


function CreateButtons ({texto}){
  if (texto === "Listo"){
    return (
      <div className={styles.botonesAccion}>
        <button type="button" className={styles.botonDescarga}>
          <FileDownloadOutlinedIcon/>
        </button>
        <button type="button" className={styles.botonPdf}>
          <TextSnippetOutlinedIcon className={styles.iconoPdf}/>
        </button>
      </div>
    );
  }else if (texto == "Pendiente"){
    return(
      <div className={styles.botonesAccion} id={styles.telegramContainer}>
        <ScheduleSendOutlinedIcon className={styles.iconoSend}/>
        <p className={styles.textoTelegram}>Esperando Telegram</p>
      </div>
    )
  }else if (texto == "Procesando"){
    return(
      <p className={styles.textoCelery}>
        <span style={{ '--i':1}}>E</span>
        <span style={{ '--i':2}}>n</span>
        <span style={{ '--i':3}}>&nbsp;</span>
        <span style={{ '--i':4}}>c</span>
        <span style={{ '--i':5}}>o</span>
        <span style={{ '--i':6}}>l</span>
        <span style={{ '--i':7}}>a</span>
        <span style={{ '--i':8}}>&nbsp;</span>
        <span style={{ '--i':9}}>C</span>
        <span style={{ '--i':10}}>e</span>
        <span style={{ '--i':11}}>l</span>
        <span style={{ '--i':12}}>e</span>
        <span style={{ '--i':13}}>r</span>
        <span style={{ '--i':14}}>y</span>
        <span style={{ '--i':15}}>&nbsp;</span>
        <span style={{ '--i':16}}>.</span>
        <span style={{ '--i':17}}>.</span>
        <span style={{ '--i':18}}>.</span>
        </p>
    );
  }else if(texto == "Rechazada"){
    return(
      <p style={{color: '#b4b4b4'}}>-</p>
    );
  }else{
    return null;
  }
}



const TablaHeaderToolbar = () =>  {
    return(
        <Toolbar className={styles.headerBarra}>
            <Typography className={styles.titulo}>
                Historial de exportaciones
            </Typography>
        </Toolbar>
    );
};

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, "Listo"),
  createData('Ice cream sandwich', 237, 9.0, 37, "Pendiente"),
  createData('Eclair', 262, 16.0, 24, "Procesando"),
  createData('Cupcake', 305, 3.7, 67, "Rechazada"),
  createData('Gingerbread', 356, 16.0, 49, "Listo"),
  createData('Gingerbread', 356, 16.0, 49, "Listo"),
];

export default function logs() {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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


  return (
    <>
    <TablaHeaderToolbar/>
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

          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): rows)
          .map((row) => (
            <TableRow id={styles.tuplas}
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{row.id}</TableCell>
              <TableCell component="rango" align="right">{row.rangelogs}</TableCell>
              <TableCell component="ctfc" align="right">{row.cuantity}</TableCell>
              <TableCell component="ctfc" align="right">{row.date_request}</TableCell>
              <TableCell align="right"><Estado texto={row.state}/></TableCell>
              <TableCell align="right"><CreateButtons texto={row.state}/></TableCell>
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