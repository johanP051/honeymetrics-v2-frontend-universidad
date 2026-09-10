import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ThreatModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    ip: '',
    country: '',
    threat_score: 50,
    category: 'Botnet'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ip: initialData.ip,
        country: initialData.country,
        threat_score: initialData.threat_score,
        category: initialData.category
      });
    } else {
      setFormData({ ip: '', country: '', threat_score: 50, category: 'Botnet' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-up">
      <div className="glass-card w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-hm-muted hover:text-hm-danger transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-display text-hm-gold mb-6">
          {initialData ? 'Editar Amenaza' : 'Nueva Amenaza'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-hm-text mb-1">Dirección IP</label>
            <input 
              type="text" 
              required
              value={formData.ip}
              onChange={e => setFormData({...formData, ip: e.target.value})}
              className="w-full bg-hm-bg border border-hm-border rounded px-3 py-2 text-hm-text focus:outline-none focus:border-hm-gold"
              placeholder="Ej. 192.168.1.1"
            />
          </div>

          <div>
            <label className="block text-sm text-hm-text mb-1">País</label>
            <input 
              type="text" 
              required
              value={formData.country}
              onChange={e => setFormData({...formData, country: e.target.value})}
              className="w-full bg-hm-bg border border-hm-border rounded px-3 py-2 text-hm-text focus:outline-none focus:border-hm-gold"
              placeholder="Ej. Rusia"
            />
          </div>

          <div>
            <label className="block text-sm text-hm-text mb-1">
              Threat Score: <span className={formData.threat_score > 70 ? 'text-hm-danger font-bold' : 'text-hm-gold font-bold'}>{formData.threat_score}</span>
            </label>
            <input 
              type="range" 
              min="0" max="100" 
              value={formData.threat_score}
              onChange={e => setFormData({...formData, threat_score: Number(e.target.value)})}
              className="w-full accent-hm-gold"
            />
          </div>

          <div>
            <label className="block text-sm text-hm-text mb-1">Categoría</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-hm-bg border border-hm-border rounded px-3 py-2 text-hm-text focus:outline-none focus:border-hm-gold"
            >
              <option value="Botnet">Botnet</option>
              <option value="APT">APT</option>
              <option value="Scanner">Scanner</option>
              <option value="Malware">Malware</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded text-hm-muted hover:bg-hm-bg hover:text-hm-text transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-transparent border border-hm-gold text-hm-gold rounded hover:bg-hm-gold hover:text-hm-bg transition-colors font-medium"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
