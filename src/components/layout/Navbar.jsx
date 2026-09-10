import React from 'react';
import { ShieldAlert, Activity, RefreshCw } from 'lucide-react';

export const Navbar = ({ isMock, onRefresh, loading }) => {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-amber)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <ShieldAlert size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            HoneyMetrics <span style={{ color: 'var(--accent-amber)' }}>2.0</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Cyber Threat Intelligence & Honeypot Analytics
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn btn-secondary"
          title="Refrescar datos"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          <span className={`badge ${isMock ? 'badge-mock' : 'badge-live'}`}>
            <Activity size={12} style={{ marginRight: '0.25rem' }} />
            {isMock ? 'Modo Mock (Offline)' : 'API en Vivo'}
          </span>
        </div>
      </div>
    </header>
  );
};
