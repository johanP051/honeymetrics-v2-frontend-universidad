import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import Estado from '../../components/common/estados';
import styles from './blacklist.module.css';

export default function ForensicVaultTable({ vaultData = [] }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedData = rowsPerPage > 0
    ? vaultData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : vaultData;

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <ArchiveOutlinedIcon sx={{ color: '#D4AF37' }} />
        <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#D4AF37' }}>
          Bóveda Forense — Amenazas Archivadas (Trazabilidad y Auditoría)
        </h2>
      </div>

      <TableContainer className={styles.tabla} component={Paper} elevation={0} square>
        <Table sx={{ minWidth: 650, width: '100%', tableLayout: 'fixed' }} aria-label="Bóveda Forense">
          <TableHead>
            <TableRow id={styles.subcolumnasLayout}>
              <TableCell>IP / TIPO</TableCell>
              <TableCell>PAÍS</TableCell>
              <TableCell>CATEGORÍA</TableCell>
              <TableCell className={styles.threatScoreCell}>SCORE ORIGINAL</TableCell>
              <TableCell>FECHA ARCHIVADO</TableCell>
              <TableCell className={styles.estadoCell}>ESTADO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaultData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#8995A2' }}>
                  No hay registros archivados en la Bóveda Forense.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow id={styles.tuplas} key={row.id || row.ip} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" className={styles.ipCell}>
                    <span>{row.ip}</span>
                    <small>{row.ip_type || (row.ip?.includes(':') ? 'IPv6' : 'IPv4')}</small>
                  </TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell className={styles.threatScoreCell}>
                    <span className={styles.threatScoreSafe}>{row.threat_score}</span>
                  </TableCell>
                  <TableCell style={{ fontSize: '0.8rem', color: '#8995A2' }}>
                    {row.deleted_at ? new Date(row.deleted_at).toLocaleString('es-CO') : 'Histórico'}
                  </TableCell>
                  <TableCell className={styles.estadoCell}>
                    <Estado texto="Archivada" mostrarIcono={false} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          className={styles.paginacion}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={vaultData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </TableContainer>
    </div>
  );
}
