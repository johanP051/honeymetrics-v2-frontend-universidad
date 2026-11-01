import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { BorderLinearProgress } from '../../components/common/linearProgress';
import Estado from '../../components/common/estados';
import styles from './blacklist.module.css';

export default function BlacklistTableRow({ row, onEdit, onDelete }) {
  const isSafe = (row.threat_score ?? 0) <= 70;

  return (
    <TableRow id={styles.tuplas} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row" className={styles.ipCell}>
        <span>
          {String(row.ip || '').split(':').map((parte, indice, partes) => (
            <React.Fragment key={`${parte}-${indice}`}>
              {parte}
              {indice < partes.length - 1 ? <>{':'}<wbr /></> : null}
            </React.Fragment>
          ))}
        </span>
        <small>{row.ip_type || (row.ip?.includes(':') ? 'IPv6' : 'IPv4')}</small>
      </TableCell>
      <TableCell>{row.country}</TableCell>
      <TableCell>{row.category}</TableCell>
      <TableCell className={styles.threatScoreCell}>
        <div className={styles.threatScoreBar}>
          <span className={isSafe ? styles.threatScoreSafe : styles.threatScoreDanger}>
            {row.threat_score}
          </span>
          <BorderLinearProgress
            variant="determinate"
            value={Number(row.threat_score || 0)}
            sx={{
              backgroundColor: '#2A3440 !important',
              '& .MuiLinearProgress-bar': {
                backgroundColor: isSafe ? '#B89A2E' : '#b30c00',
              },
            }}
          />
        </div>
      </TableCell>
      <TableCell className={styles.estadoCell}>
        <Estado texto={row.status} mostrarIcono={false} />
      </TableCell>
      <TableCell className={styles.accionesCell}>
        <div className={styles.accionesBotones}>
          <IconButton
            className={styles.editarButton}
            aria-label={`Editar amenaza ${row.ip}`}
            onClick={() => onEdit(row)}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton
            className={styles.eliminarButton}
            aria-label={`Eliminar amenaza ${row.ip}`}
            onClick={() => onDelete(row.id)}
          >
            <DeleteForeverOutlinedIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
}
