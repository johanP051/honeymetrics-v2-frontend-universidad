import * as React from 'react';
import PropTypes from 'prop-types';
import styles from "./blacklist.module.css"
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';



function createData(id, country, category, threat_score, state, action) {
  return {id, country, category, threat_score, state, action};
}
const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 6),
  createData('Eclair', 262, 16.0, 24, 6.0, 2),
  createData('Cupcake', 305, 3.7, 67, 4.3, 1),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 0),
];

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


const TablaHeaderToolbar = () =>  {
    return(
        <Toolbar className={styles.headerBarra}>
            <Typography className={styles.titulo}>
                Historial de exportaciones
            </Typography>
        </Toolbar>
    );
};

export default function Blacklist() {


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
    <div>
    <GppMaybeOutlinedIcon/>
    <h1>Threat Intelligence Center</h1>
    </div>
    <TablaHeaderToolbar/>
    <TableContainer className={styles.tabla} component={Paper} elevation={0} square>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow id={styles.subcolumnasLayout}>
            <TableCell>ID</TableCell>
            <TableCell align="right">PAÍS</TableCell>
            <TableCell align="right">CATEGORIA</TableCell>
            <TableCell align="right">THREAT SCORE</TableCell>
            <TableCell align="right">ESTADO</TableCell>
            <TableCell align="right">ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): rows)
          .map((row) => (
            <TableRow id={styles.tuplas}
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{row.id}</TableCell>
              <TableCell align="right">{row.country}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">{row.threat_score}</TableCell>
              <TableCell align="right">{row.state}</TableCell>
              <TableCell align="right">{row.action}</TableCell>
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
    </>
  );
}