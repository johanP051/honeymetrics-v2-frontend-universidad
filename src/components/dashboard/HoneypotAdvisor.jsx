import React from 'react';
import { Terminal, Database, User, Server, ShieldAlert } from 'lucide-react';
import { topTargetedUsers } from '../../mocks/advisorMockData';

export default function HoneypotAdvisor() {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Database':
        return <Database size={15} className="text-hm-info shrink-0" />;
      case 'DevOps':
        return <Server size={15} className="text-hm-gold shrink-0" />;
      case 'ERP':
        return <ShieldAlert size={15} className="text-hm-danger shrink-0" />;
      case 'System':
      default:
        return <Terminal size={15} className="text-hm-gold shrink-0" />;
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'critical':
        return 'text-hm-danger bg-hm-danger/10 border-hm-danger/30';
      case 'high':
        return 'text-hm-gold bg-hm-gold/10 border-hm-gold/30';
      case 'medium':
      default:
        return 'text-hm-info bg-hm-info/10 border-hm-info/30';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-hm-text">Honeypot Advisor</h3>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-hm-gold/10 text-hm-gold border border-hm-gold/20">
            CTI Recon
          </span>
        </div>
        <p className="text-xs text-hm-muted mt-0.5">Top diccionarios SSH probados</p>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-3 overflow-y-auto pr-1">
        {topTargetedUsers.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-hm-bg/60 border border-hm-border/60 hover:border-hm-gold/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-hm-elevated border border-hm-border">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <span className="font-mono text-sm font-semibold text-hm-gold">
                    {item.username}
                  </span>
                  <span className="text-[10px] text-hm-muted ml-2">
                    ({item.category})
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-hm-text">
                  {item.attempts.toLocaleString()}
                </span>
                <span className="text-[10px] text-hm-muted ml-1">intentos</span>
              </div>
            </div>

            {/* Mini barra de progreso */}
            <div className="flex items-center gap-2">
              <div className="w-full bg-hm-elevated h-1.5 rounded-full overflow-hidden border border-hm-border/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.riskLevel === 'critical'
                      ? 'bg-hm-danger shadow-[0_0_8px_rgba(208,107,98,0.5)]'
                      : item.riskLevel === 'high'
                      ? 'bg-hm-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]'
                      : 'bg-hm-info shadow-[0_0_8px_rgba(75,139,191,0.5)]'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-hm-muted shrink-0 w-10 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
