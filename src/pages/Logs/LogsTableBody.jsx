import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Estado from '../../components/common/estados';
import LogsActionButtons from './LogsActionButtons';
import { TextoAnimado } from './LogsPaginationActions';
import styles from './logs.module.css';

export default function LogsTableBody({
  error,
  estadosSeleccionados,
  rowsVisibles,
  rowsPerPage,
  page,
  emptyRows,
  descargandoId,
  generandoReporteId,
  onDownload,
  onGenerarReporte,
}) {
  const paginatedRows = rowsPerPage > 0
    ? rowsVisibles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rowsVisibles;

  return (
    <TableBody>
      {error ? (
        <TableRow>
          <TableCell className={styles.errorCell} colSpan={6}>
            <p className={styles.errorText} role="alert">{error}</p>
          </TableCell>
        </TableRow>
      ) : !estadosSeleccionados.length ? (
        <TableRow id={styles.tuplas}>
          <TableCell className={styles.emptyFilterCell} colSpan={6}>
            <TextoAnimado texto="Aplique al menos un filtro." />
          </TableCell>
        </TableRow>
      ) : rowsVisibles.length === 0 ? (
        <TableRow id={styles.tuplas}>
          <TableCell className={styles.emptyFilterCell} colSpan={6}>
            <p className={styles.textoVacio}>No se encontraron exportaciones.</p>
          </TableCell>
        </TableRow>
      ) : (
        paginatedRows.map((row) => (
          <TableRow id={styles.tuplas} key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">{row.id}</TableCell>
            <TableCell className={styles.rangoCell} align="right">{row.date_range}</TableCell>
            <TableCell className={styles.ctfcCell} align="right">{row.count}</TableCell>
            <TableCell className={styles.ctfcCell} align="right">{row.created_at}</TableCell>
            <TableCell align="right"><Estado texto={row.status} /></TableCell>
            <TableCell align="right">
              <LogsActionButtons
                texto={row.status}
                exportId={row.id}
                descargandoId={descargandoId}
                generandoReporteId={generandoReporteId}
                onDownload={onDownload}
                onGenerarReporte={onGenerarReporte}
              />
            </TableCell>
          </TableRow>
        ))
      )}
      {emptyRows > 0 && (
        <TableRow className={styles.filaVacia} style={{ height: 53 * emptyRows }}>
          <TableCell className={styles.celdaVacia} colSpan={6} />
        </TableRow>
      )}
    </TableBody>
  );
}
