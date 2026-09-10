import React from 'react';
import { Skull, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

export const ThreatScoreCard = ({ attacker }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--accent-red)';
    if (score >= 70) return 'var(--accent-amber)';
    return 'var(--accent-blue)';
  };

  const getBadgeClass = (badge) => {
    if (badge === 'APT') return 'badge-apt';
    if (badge.includes('Botnet')) return 'badge-botnet';
    return 'badge-recon';
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className={`badge ${getBadgeClass(attacker.badge)}`} style={{ marginBottom: '0.4rem' }}>
            {attacker.badge}
          </span>
          <h3 className="font-mono" style={{ fontSize: '1.05rem', fontWeight: '700' }}>
            {attacker.ip}
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            color: getScoreColor(attacker.threat_score),
            lineHeight: 1
          }}>
            {attacker.threat_score}
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '500' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Threat Score
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
        <div>
          <span style={{ color: 'var(--text-dim)', display: 'block' }}>Eventos:</span>
          <strong>{attacker.total_events.toLocaleString()}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)', display: 'block' }}>Táctica MITRE:</span>
          <strong>{attacker.primary_tactic}</strong>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
        <span style={{ color: 'var(--text-dim)' }}>Usuarios atacados: </span>
        {attacker.targeted_users.map((u, i) => (
          <code key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '3px', marginRight: '0.25rem' }}>
            {u}
          </code>
        ))}
      </div>

      {attacker.is_persistent && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.75rem',
          color: '#f87171',
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '0.35rem 0.5rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          <Clock size={12} />
          <span>Reincidente multimes: {attacker.months_active.join(', ')}</span>
        </div>
      )}
    </div>
  );
};
