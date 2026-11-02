import React, { useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from '@mui/material/TableFooter';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import useThreatCRUD from '../../hooks/useThreatCRUD';
import BlacklistTableRow from './BlacklistTableRow';
import BlacklistModal from './BlacklistModal';
import ForensicVaultTable from './ForensicVaultTable';
import { TablePaginationActions } from '../Logs/LogsPaginationActions';
import styles from './blacklist.module.css';

export default function Blacklist() {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [threatToEdit, setThreatToEdit] = useState(null);

  const { data: threats, vaultData, isLoading, addThreat, updateThreat, deleteThreat } = useThreatCRUD();

  const filteredThreats = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return threats;
    return threats.filter((t) => [t.ip, t.country, t.category, t.status].some((v) => String(v || '').toLowerCase().includes(term)));
  }, [threats, searchTerm]);

  const handleOpenEdit = (threat) => {
    setThreatToEdit(threat);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (formData.id) await updateThreat(formData.id, formData);
    else await addThreat(formData);
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className={styles.loadingOverlay} role="status" aria-label="Cargando blacklist">
          <CircularProgress aria-label="Cargando" />
        </div>
      )}

      <div>
        <div className={styles.encabezado}>
        <div className={styles.tituloFila}>
          <GppMaybeOutlinedIcon className={styles.tituloIcono} />
          <h1>Threat Intelligence Center</h1>
        </div>
        <p>Gestión y análisis de indicadores de compromiso (IoC) y Bóveda Forense.</p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <button
            type="button"
            className={`${styles.anadirAmenazaTexto} ${activeTab === 'active' ? styles.guardarModal : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Amenazas Activas ({threats.length})
          </button>
          <button
            type="button"
            className={`${styles.anadirAmenazaTexto} ${activeTab === 'vault' ? styles.guardarModal : ''}`}
            onClick={() => setActiveTab('vault')}
          >
            Bóveda Forense ({vaultData.length})
          </button>
          <input
            type="search"
            placeholder="Buscar por IP, país o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: '8px', border: '1px solid #3B4655', background: '#1B212B', color: '#FFF', width: '250px' }}
          />
        </div>
      </div>

      {activeTab === 'active' ? (
        <>
          <TableContainer className={styles.tabla} component={Paper} elevation={0} square>
            <Table sx={{ minWidth: 650, width: '100%', tableLayout: 'fixed' }} aria-label="Amenazas Activas">
              <TableHead>
                <TableRow id={styles.subcolumnasLayout}>
                  <TableCell>IP / TIPO</TableCell>
                  <TableCell>PAÍS</TableCell>
                  <TableCell>CATEGORÍA</TableCell>
                  <TableCell className={styles.threatScoreCell}>THREAT SCORE</TableCell>
                  <TableCell className={styles.estadoCell}>ESTADO</TableCell>
                  <TableCell className={styles.accionesHeader}>ACCIONES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredThreats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#8995A2' }}>
                      No se encontraron amenazas activas.
                    </TableCell>
                  </TableRow>
                ) : (
                  (rowsPerPage > 0 ? filteredThreats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredThreats).map((row) => (
                    <BlacklistTableRow key={row.id || row.ip} row={row} onEdit={handleOpenEdit} onDelete={deleteThreat} />
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    className={styles.paginacion}
                    id={styles.subcolumnasLayout}
                    rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                    colSpan={6}
                    count={filteredThreats.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          <button
            type="button"
            className={styles.anadirAmenazaTexto}
            style={{ marginTop: '16px' }}
            onClick={() => { setThreatToEdit(null); setModalOpen(true); }}
          >
            + Añadir amenaza
          </button>
        </>
      ) : (
        <ForensicVaultTable vaultData={vaultData} />
      )}
      </div>

      <BlacklistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        threatToEdit={threatToEdit}
      />
    </div>
  );
}