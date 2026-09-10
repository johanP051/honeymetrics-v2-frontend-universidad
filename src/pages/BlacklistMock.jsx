import React, { useState } from 'react';
import { Search, Plus, Filter, Shield, ShieldAlert } from 'lucide-react';

export default function BlacklistMock() {
  const [showModal, setShowModal] = useState(false);

  const mockData = [
    { ip: '192.168.1.100', score: 85, type: 'Public', status: 'Blocked', date: '2024-10-28 14:00' },
    { ip: '10.0.0.5', score: 20, type: 'Private', status: 'Monitored', date: '2024-10-28 13:45' },
    { ip: '172.16.254.1', score: 95, type: 'Public', status: 'Blocked', date: '2024-10-28 12:10' },
    { ip: '192.168.10.55', score: 45, type: 'Private', status: 'Monitored', date: '2024-10-28 11:05' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-hm-text">Threat Intelligence Center</h2>
          <p className="text-hm-muted">Gestión de IPs atacantes y Score Dinámico</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-hm-gold text-black px-4 py-2 rounded font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors"
        >
          <Plus size={20} />
          <span>Agregar IP Manualmente</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-hm-muted" size={20} />
          <input 
            type="text" 
            placeholder="Buscar dirección IP..." 
            className="w-full bg-hm-bg border border-hm-border text-hm-text pl-10 pr-4 py-2 rounded focus:outline-none focus:border-hm-gold"
          />
        </div>
        <button className="bg-hm-card border border-hm-border text-hm-text px-4 py-2 rounded flex items-center gap-2 hover:border-hm-gold/50">
          <Filter size={20} />
          <span>Filtros</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-hm-card border border-hm-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-hm-bg border-b border-hm-border">
            <tr>
              <th className="px-6 py-4 text-hm-muted font-medium">Dirección IP</th>
              <th className="px-6 py-4 text-hm-muted font-medium">Threat Score (0-100)</th>
              <th className="px-6 py-4 text-hm-muted font-medium">Clasificación</th>
              <th className="px-6 py-4 text-hm-muted font-medium">Estado</th>
              <th className="px-6 py-4 text-hm-muted font-medium">Última Actividad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hm-border">
            {mockData.map((row, idx) => (
              <tr key={idx} className="hover:bg-hm-bg/50 transition-colors">
                <td className="px-6 py-4 font-mono text-hm-text">{row.ip}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${row.score > 70 ? 'text-hm-danger' : 'text-hm-gold'}`}>
                      {row.score}
                    </span>
                    <div className="w-24 h-2 bg-hm-bg rounded overflow-hidden">
                      <div 
                        className={`h-full ${row.score > 70 ? 'bg-hm-danger' : 'bg-hm-gold'}`} 
                        style={{ width: `${row.score}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    row.type === 'Public' ? 'bg-hm-danger/20 text-hm-danger border border-hm-danger/30' : 'bg-hm-success/20 text-hm-success border border-hm-success/30'
                  }`}>
                    {row.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-hm-text">
                    {row.status === 'Blocked' ? <ShieldAlert size={16} className="text-hm-danger"/> : <Shield size={16} className="text-hm-info"/>}
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-hm-muted">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay Simulacion */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-hm-card border border-hm-gold/50 rounded-lg p-6 w-96 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <h3 className="text-xl font-bold text-hm-text mb-4">Agregar Regla Manual</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-hm-muted mb-1">Dirección IP o CIDR</label>
                <input type="text" className="w-full bg-hm-bg border border-hm-border text-hm-text px-3 py-2 rounded focus:outline-none focus:border-hm-gold" placeholder="Ej. 192.168.1.1/24" />
              </div>
              <div>
                <label className="block text-sm text-hm-muted mb-1">Motivo</label>
                <textarea className="w-full bg-hm-bg border border-hm-border text-hm-text px-3 py-2 rounded focus:outline-none focus:border-hm-gold" rows="3"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-hm-muted hover:text-hm-text">Cancelar</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-hm-gold text-black font-medium rounded hover:bg-yellow-500">Guardar Regla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
