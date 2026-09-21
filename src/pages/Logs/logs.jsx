import styles from "./logs.module.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Estado from "../../components/common/estadoLogs";

function createData(id, rangelogs, cuantity, date_request, state, action) {
  return {id, rangelogs, cuantity, date_request, state, action};
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
];

export default function logs() {
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
          {rows.map((row) => (
            <TableRow id={styles.tuplas}
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.id}</TableCell>
              <TableCell component="rango" align="right">{row.rangelogs}</TableCell>
              <TableCell component="ctfc" align="right">{row.cuantity}</TableCell>
              <TableCell component="ctfc" align="right">{row.date_request}</TableCell>
              <TableCell align="right"><Estado texto={row.state}/></TableCell>
              <TableCell align="right">{row.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}