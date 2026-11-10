import React from 'react';
import { Terminal, Database, Server, ShieldAlert } from 'lucide-react';

const advisorTemplates = [
  { name: 'root', type: 'System', percentage: 59.6, icon: Terminal, color: 'text-amber-400', barColor: 'bg-amber-400' },
  { name: 'admin', type: 'System', percentage: 17.2, icon: Terminal, color: 'text-amber-400', barColor: 'bg-amber-400' },
  { name: 'postgres', type: 'Database', percentage: 8.6, icon: Database, color: 'text-blue-400', barColor: 'bg-blue-400' },
  { name: 'odoo', type: 'ERP', percentage: 6.0, icon: ShieldAlert, color: 'text-red-400', barColor: 'bg-red-400' },
  { name: 'jenkins', type: 'DevOps', percentage: 3.2, icon: Server, color: 'text-amber-400', barColor: 'bg-amber-400' },
  { name: 'Ubuntu', type: 'System', percentage: 2.3, icon: Terminal, color: 'text-amber-400', barColor: 'bg-amber-400' },
];

export default function HoneypotAdvisor({ totalEvents = 0 }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-display font-semibold text-hm-text">
            Honeypot Advisor
          </h3>
          <p className="text-xs text-hm-muted mt-0.5 break-words">Top diccionarios SSH probados</p>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-hm-gold/10 text-hm-gold border border-hm-gold/30 shrink-0">
          CTI RECON
        </span>
      </div>

      <div
        role="region"
        aria-label="Top diccionarios SSH probados"
        className="flex-1 flex flex-col space-y-2.5 overflow-y-auto pr-1 pb-2"
      >
        {advisorTemplates.map(({ name, type, percentage, icon: Icon, color, barColor }) => {
          const attempts = Math.max(1, Math.round((totalEvents || 0) * (percentage / 100)));
          return (
            <div
              key={name}
              className="p-2.5 rounded-lg bg-hm-elevated/60 border border-hm-border hover:border-hm-gold/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-hm-card border border-hm-border">
                    <Icon size={14} className={color} aria-hidden="true" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-xs font-semibold text-hm-gold">{name}</span>
                    <span className="text-[10px] text-hm-muted">({type})</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-hm-text">
                    {attempts.toLocaleString('es-CO')}
                  </span>
                  <span className="text-[10px] text-hm-muted ml-1">intentos</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-full bg-hm-card h-1.5 rounded-full overflow-hidden border border-hm-border">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-hm-muted shrink-0 w-9 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
