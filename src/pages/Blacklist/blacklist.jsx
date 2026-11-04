import React, { useState, useMemo } from 'react';
import { ShieldAlert, Shield, Archive, Search, Plus } from 'lucide-react';
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

  const { hasScope } = useAuth();
  const { data: threats, vaultData, isLoading, error, isFallback, addThreat, updateThreat, deleteThreat } = useThreatCRUD();

  const hasPermission = (perm) => {
    if (!hasScope) return true;
    if (perm === 'threats:audit_view') return hasScope('threats:audit_view') || hasScope('threats:read') || hasScope('admin:all');
    if (perm === 'threats:create') return hasScope('threats:create') || hasScope('threats:write') || hasScope('admin:all');
    return hasScope(perm) || hasScope('admin:all');
  };

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
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="status" aria-label="Cargando">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
        </div>
      )}

      <div>
        <div className="flex items-center gap-3 mb-1">
          <ShieldAlert className="w-8 h-8 text-amber-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
            Threat Intelligence Center
          </h1>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Gestión de Lista Negra (Active Response), IOCs y Auditoría Forense.
        </p>
        <StatusBanner isFallback={isFallback} error={error} />
      </div>

      <div className="glass-card w-full rounded-xl border border-slate-700/60 bg-slate-900/40 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/40">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('active'); setPage(0); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'active'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Amenazas Activas</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'active' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'}`}>
                {threats.length}
              </span>
            </button>

            {hasPermission('threats:audit_view') && (
              <button
                type="button"
                onClick={() => { setActiveTab('vault'); setPage(0); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'vault'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>Bóveda Forense</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'vault' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'}`}>
                  {vaultData.length}
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                placeholder="Buscar IP o país..."
                className="w-full bg-slate-900/60 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-3 py-2 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {hasPermission('threats:create') && (
              <button
                type="button"
                onClick={() => { setThreatToEdit(null); setModalOpen(true); }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Amenaza</span>
              </button>
            )}
          </div>
        </div>

        {activeTab === 'active' ? (
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-left border-collapse" aria-label="Amenazas Activas">
                <thead className="bg-slate-900/70 border-b border-slate-700/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="p-4">IP / TIPO</th>
                    <th scope="col" className="p-4">PAÍS</th>
                    <th scope="col" className="p-4">CATEGORÍA</th>
                    <th scope="col" className="p-4">ESTADO</th>
                    <th scope="col" className="p-4">THREAT SCORE</th>
                    <th scope="col" className="p-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredThreats.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
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
                        canEdit={hasPermission('threats:create')}
                        canDelete={hasPermission('threats:create')}
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