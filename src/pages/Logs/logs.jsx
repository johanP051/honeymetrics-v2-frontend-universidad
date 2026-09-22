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
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';

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
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{row.id}</TableCell>
              <TableCell component="rango" align="right">{row.rangelogs}</TableCell>
              <TableCell component="ctfc" align="right">{row.cuantity}</TableCell>
              <TableCell component="ctfc" align="right">{row.date_request}</TableCell>
              <TableCell align="right"><Estado texto={row.state}/></TableCell>
              <TableCell align="right"><CreateButtons texto={row.state}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}