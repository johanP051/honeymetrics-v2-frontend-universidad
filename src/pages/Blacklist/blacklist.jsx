import React, { useState, useMemo } from 'react';
import { ShieldAlert, Shield, Archive, Search, Plus, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useThreatCRUD from '../../hooks/useThreatCRUD';
import StatusBanner from '../../components/layout/StatusBanner';
import BlacklistTableRow from './BlacklistTableRow';
import BlacklistModal from './BlacklistModal';
import ForensicVaultTable from './ForensicVaultTable';
import BlacklistPagination from './BlacklistPagination';

export default function Blacklist() {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [threatToEdit, setThreatToEdit] = useState(null);

  const { hasScope, role } = useAuth();
  const { data: threats, vaultData, isLoading, error, isFallback, addThreat, updateThreat, deleteThreat } = useThreatCRUD();

  const canWrite = Boolean(hasScope('threats:write') || hasScope('admin:all'));
  const canDelete = Boolean(hasScope('threats:delete') || hasScope('admin:all'));
  const canViewVault = Boolean(hasScope('blacklist:read') || hasScope('threats:read') || hasScope('admin:all'));
  const isConsultor = String(role || '').toLowerCase().startsWith('consultor');

  const filteredThreats = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return threats;
    return threats.filter((t) => [t.ip, t.country, t.category, t.status].some((v) => String(v || '').toLowerCase().includes(term)));
  }, [threats, searchTerm]);

  const paginatedThreats = useMemo(() => {
    return filteredThreats.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [filteredThreats, page, rowsPerPage]);

  const handleOpenEdit = (threat) => { setThreatToEdit(threat); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (window.confirm('¿Desea archivar esta amenaza en la Bóveda Forense?')) {
      await deleteThreat(id);
    }
  };

  const handleModalSubmit = async (formData) => {
    if (formData.id) await updateThreat(formData.id, formData);
    else await addThreat(formData);
  };

  return (
    <div className="space-y-6 animate-fade-up pb-10">
      <div className="border-b border-hm-border/70 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-hm-gold font-display flex items-center gap-2.5">
          <ShieldAlert size={28} aria-hidden="true" />
          Threat Intelligence Center
        </h1>
        <p className="text-hm-muted text-xs sm:text-sm mt-1">
          Gestión de Lista Negra (Active Response), IOCs y Auditoría Forense.
        </p>
      </div>

      <StatusBanner isFallback={isFallback} error={error} endpoint="/api/v1/threats" />

      <div className="glass-card w-full overflow-hidden">
        <div className="p-4 border-b border-hm-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-hm-elevated/40">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('active'); setPage(0); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'active'
                  ? 'bg-hm-gold/15 text-hm-gold border border-hm-gold/30'
                  : 'text-hm-muted hover:text-hm-text hover:bg-hm-elevated/60 border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Amenazas Activas</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${activeTab === 'active' ? 'bg-hm-gold/20 text-hm-gold font-bold' : 'bg-hm-elevated text-hm-muted'}`}>
                {threats.length}
              </span>
            </button>

            {canViewVault && (
              <button
                type="button"
                onClick={() => { setActiveTab('vault'); setPage(0); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === 'vault'
                    ? 'bg-hm-gold/15 text-hm-gold border border-hm-gold/30'
                    : 'text-hm-muted hover:text-hm-text hover:bg-hm-elevated/60 border border-transparent'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>Bóveda Forense</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${activeTab === 'vault' ? 'bg-hm-gold/20 text-hm-gold font-bold' : 'bg-hm-elevated text-hm-muted'}`}>
                  {vaultData.length}
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-hm-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                placeholder="Buscar IP o país..."
                className="w-full bg-hm-elevated border border-hm-border text-hm-text text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2 placeholder-hm-muted focus:outline-none focus:border-hm-gold transition-colors"
              />
            </div>

            {canWrite ? (
              <button
                type="button"
                onClick={() => { setThreatToEdit(null); setModalOpen(true); }}
                className={`${
                  isConsultor
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
                    : 'bg-hm-gold hover:bg-hm-goldHover shadow-hm-gold/15'
                } text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg whitespace-nowrap`}
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Amenaza</span>
              </button>
            ) : (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 whitespace-nowrap"
                title="Su rol tiene acceso de consulta (Solo Lectura) según CU03"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Modo Lectura</span>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'active' ? (
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-left border-collapse" aria-label="Amenazas Activas">
                <thead className="bg-hm-elevated/80 border-b border-hm-border text-xs font-semibold text-hm-muted uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="p-4">IP / TIPO</th>
                    <th scope="col" className="p-4">PAÍS</th>
                    <th scope="col" className="p-4">CATEGORÍA</th>
                    <th scope="col" className="p-4">ESTADO</th>
                    <th scope="col" className="p-4">THREAT SCORE</th>
                    <th scope="col" className="p-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hm-border/40">
                  {isLoading && filteredThreats.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-hm-muted text-sm">
                        <div className="inline-flex items-center gap-3" role="status" aria-label="Cargando amenazas">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-hm-gold border-t-transparent" />
                          <span>Cargando inteligencia de amenazas...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredThreats.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-hm-muted text-sm">
                        No se encontraron amenazas activas que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    paginatedThreats.map((row) => (
                      <BlacklistTableRow
                        key={row.id || row.ip}
                        row={row}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                        canEdit={canWrite}
                        canDelete={canDelete}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <BlacklistPagination page={page} setPage={setPage} total={filteredThreats.length} rowsPerPage={rowsPerPage} />
          </>
        ) : (
          <ForensicVaultTable vaultData={vaultData} searchTerm={searchTerm} />
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