import React from 'react';
import { Network, ShieldAlert } from 'lucide-react';

export const BotnetAlertBadge = ({ botnet }) => {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem 1.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-amber)',
        }}>
          <Network size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="font-mono" style={{ fontSize: '1rem', fontWeight: '700' }}>
              {botnet.subnet}
            </span>
            <span className="badge badge-botnet">
              {botnet.distinct_ips_count} Nodos Coordinados
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {botnet.total_events.toLocaleString()} intentos registrados • {botnet.suggested_action}
          </p>
        </div>
      </div>

      <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
        Bloquear Rango CIDR
      </button>
    </div>
  );
};
