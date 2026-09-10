import React from 'react';
import { Download, Send, FileJson, CheckCircle, Clock } from 'lucide-react';

export default function LogsMock() {
  const exportHistory = [
    { id: 'EXP-1042', type: 'Audits', size: '11.3 MiB', status: 'Ready', date: '2024-10-27 16:45:12' },
    { id: 'EXP-1043', type: 'Network Logs', size: '78.9 MiB', status: 'Processing', date: '2024-10-27 16:10:05' },
    { id: 'EXP-1044', type: 'Firewall Data', size: '215.1 MiB', status: 'Pending', date: '2024-10-27 15:30:22' },
    { id: 'EXP-1045', type: 'User Activity', size: '6.7 MiB', status: 'Ready', date: '2024-10-27 14:02:40' },
  ];

  return (
    <div className="p-8 flex gap-8">
      
      {/* Columna Principal - Historial de Exportaciones */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-hm-text">Exportación de Logs</h2>
            <p className="text-hm-muted">Historial de archivos JSONL generados por el sistema</p>
          </div>
          <button className="bg-hm-info text-white px-4 py-2 rounded font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors">
            <FileJson size={20} />
            <span>Generar Nuevo Export</span>
          </button>
        </div>

        <div className="bg-hm-card border border-hm-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-hm-bg border-b border-hm-border">
              <tr>
                <th className="px-6 py-4 text-hm-muted font-medium">Fecha</th>
                <th className="px-6 py-4 text-hm-muted font-medium">Tipo de Log</th>
                <th className="px-6 py-4 text-hm-muted font-medium">Tamaño</th>
                <th className="px-6 py-4 text-hm-muted font-medium">Estado</th>
                <th className="px-6 py-4 text-right text-hm-muted font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hm-border">
              {exportHistory.map((row, idx) => (
                <tr key={idx} className="hover:bg-hm-bg/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-hm-muted">{row.date}</td>
                  <td className="px-6 py-4 text-hm-text">{row.type}</td>
                  <td className="px-6 py-4 text-hm-muted">{row.size}</td>
                  <td className="px-6 py-4">
                    {row.status === 'Ready' && <span className="inline-flex items-center gap-1 text-hm-success border border-hm-success/30 bg-hm-success/10 px-2 py-1 rounded text-xs"><CheckCircle size={12}/> Ready</span>}
                    {row.status === 'Processing' && <span className="inline-flex items-center gap-1 text-hm-gold border border-hm-gold/30 bg-hm-gold/10 px-2 py-1 rounded text-xs"><Clock size={12}/> Processing</span>}
                    {row.status === 'Pending' && <span className="inline-flex items-center gap-1 text-hm-muted border border-hm-muted/30 bg-hm-bg px-2 py-1 rounded text-xs"> Pending</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {row.status === 'Ready' && (
                      <button className="text-hm-gold hover:text-yellow-400 p-2">
                        <Download size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Columna Secundaria - Bot Telegram */}
      <div className="w-96">
        <div className="bg-hm-card border border-hm-border rounded-lg p-6 mb-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
            <Send className="text-blue-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-hm-text mb-2">Integración con Telegram</h3>
          <p className="text-hm-muted text-sm mb-6">Vincula tu cuenta para recibir alertas críticas y el enlace de descarga segura directamente en tu dispositivo móvil.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-hm-muted mb-1">Chat ID de Telegram</label>
              <input type="text" className="w-full bg-hm-bg border border-hm-border text-hm-text px-3 py-2 rounded focus:outline-none focus:border-hm-gold" placeholder="Ej. 123456789" />
            </div>
            <button className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition-colors">
              Vincular Dispositivo
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
