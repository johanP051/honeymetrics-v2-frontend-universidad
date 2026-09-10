import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useThreatCRUD } from '../hooks/useThreatCRUD';
import ThreatModal from '../components/threats/ThreatModal';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export default function ThreatCenter() {
  const { role } = useAuth();
  const { data, isLoading, error, addThreat, updateThreat, deleteThreat } = useThreatCRUD();

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingThreat, setEditingThreat] = useState(null);

  // RBAC: Directivo de T.I. no puede editar listas negras
  const isDirectivo = role === 'Directivo de T.I.' || role === 'Directivo';

  const handleOpenCreate = () => {
    setEditingThreat(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (threat) => {
    setEditingThreat(threat);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta amenaza?')) {
      await deleteThreat(id);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingThreat) {
        await updateThreat(editingThreat.id, formData);
      } else {
        await addThreat(formData);
      }
      setIsModalOpen(false);
    } catch {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="animate-fade-up pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-hm-gold flex items-center gap-3">
            <ShieldAlert size={32} />
            Threat Intelligence Center
          </h1>
          <p className="text-hm-muted mt-2">Gestión y análisis de indicadores de compromiso (IoC).</p>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          disabled={isDirectivo || isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isDirectivo 
              ? 'opacity-50 cursor-not-allowed border border-hm-muted text-hm-muted' 
              : 'border border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg shadow-[0_0_10px_rgba(212,175,55,0.2)]'
          }`}
        >
          <Plus size={20} />
          <span>Añadir Amenaza</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-hm-danger/10 text-hm-danger border border-hm-danger/30 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
          <ShieldAlert size={20} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="glass-card overflow-hidden">

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-hm-bg border-b border-hm-border">
              <th className="p-4 text-sm font-semibold text-hm-muted">IP / TIPO</th>
              <th className="p-4 text-sm font-semibold text-hm-muted">PAÍS</th>
              <th className="p-4 text-sm font-semibold text-hm-muted">CATEGORÍA</th>
              <th className="p-4 text-sm font-semibold text-hm-muted">ESTADO</th>
              <th className="p-4 text-sm font-semibold text-hm-muted min-w-[150px]">THREAT SCORE</th>
              <th className="p-4 text-sm font-semibold text-hm-muted text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-hm-muted">No hay amenazas registradas.</td>
              </tr>
            ) : (
              data.map((threat) => (
                <tr key={threat.id} className="border-b border-hm-border/50 hover:bg-hm-elevated/50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-hm-text">{threat.ip}</div>
                    <div className="text-xs text-hm-muted">{threat.type}</div>
                  </td>
                  <td className="p-4 text-hm-text">{threat.country}</td>
                  <td className="p-4 text-hm-text">{threat.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      threat.status === 'Bloqueada' 
                        ? 'bg-hm-danger/10 text-hm-danger border border-hm-danger/30'
                        : 'bg-hm-warning/10 text-hm-warning border border-hm-warning/30'
                    }`}>
                      {threat.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${threat.threat_score > 70 ? 'text-hm-danger' : 'text-hm-gold'}`}>
                        {threat.threat_score}
                      </span>
                      <div className="flex-1 h-2 bg-hm-bg rounded-full overflow-hidden border border-hm-border">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${threat.threat_score > 70 ? 'bg-hm-danger' : 'bg-hm-gold'}`}
                          style={{ width: `${threat.threat_score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(threat)}
                        disabled={isDirectivo || isLoading}
                        className={`p-2 rounded transition-colors ${
                          isDirectivo ? 'text-hm-border cursor-not-allowed' : 'text-hm-info hover:bg-hm-info/20'
                        }`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(threat.id)}
                        disabled={isDirectivo || isLoading}
                        className={`p-2 rounded transition-colors ${
                          isDirectivo ? 'text-hm-border cursor-not-allowed' : 'text-hm-danger hover:bg-hm-danger/20'
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ThreatModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingThreat}
      />
    </div>
  );
}
