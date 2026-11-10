import React from 'react';
import { Activity, Globe, ShieldAlert, Cpu } from 'lucide-react';

export default function DashboardMetricsGrid({ metrics }) {
  const kpis = [
    {
      label: 'Total Ataques',
      value: Number(metrics?.total_analyzed_events || 0).toLocaleString('es-CO'),
      icon: Activity,
      textColor: 'text-hm-info',
      hoverBorder: 'hover:border-hm-info/50',
    },
    {
      label: 'IPs Atacantes',
      value: Number(metrics?.unique_attacker_ips || 0).toLocaleString('es-CO'),
      icon: Globe,
      textColor: 'text-hm-gold',
      hoverBorder: 'hover:border-hm-gold/50',
    },
    {
      label: 'Amenazas Persistentes',
      value: Number(metrics?.persistent_threats_count || 0).toLocaleString('es-CO'),
      icon: ShieldAlert,
      textColor: 'text-hm-danger',
      hoverBorder: 'hover:border-hm-danger/50',
    },
    {
      label: 'CVEs Activos',
      value: Number(metrics?.active_critical_cves_count || 0).toLocaleString('es-CO'),
      icon: Cpu,
      textColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`glass-card p-6 transition-all group ${kpi.hoverBorder}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-hm-muted">{kpi.label}</span>
              <Icon
                className={`w-5 h-5 ${kpi.textColor} opacity-85 group-hover:opacity-100 transition-opacity`}
                aria-hidden="true"
              />
            </div>
            <p className={`text-3xl sm:text-4xl font-display font-bold ${kpi.textColor}`}>
              {kpi.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
