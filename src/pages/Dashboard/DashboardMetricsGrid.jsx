import React from 'react';
import { Activity, Globe, ShieldAlert, Cpu } from 'lucide-react';

export default function DashboardMetricsGrid({ metrics }) {
  const kpis = [
    {
      label: 'Total Ataques',
      value: Number(metrics?.total_analyzed_events || 0).toLocaleString('en-US'),
      icon: Activity,
      textColor: 'text-blue-400',
      hoverBorder: 'hover:border-blue-500/40',
    },
    {
      label: 'IPs Atacantes',
      value: Number(metrics?.unique_attacker_ips || 0).toLocaleString('en-US'),
      icon: Globe,
      textColor: 'text-amber-500',
      hoverBorder: 'hover:border-amber-500/40',
    },
    {
      label: 'Amenazas Persistentes',
      value: Number(metrics?.persistent_threats_count || 0).toLocaleString('en-US'),
      icon: ShieldAlert,
      textColor: 'text-red-400',
      hoverBorder: 'hover:border-red-500/40',
    },
    {
      label: 'CVEs Activos',
      value: Number(metrics?.active_critical_cves_count || 0).toLocaleString('en-US'),
      icon: Cpu,
      textColor: 'text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`bg-[#161f30]/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-6 shadow-lg transition-all group ${kpi.hoverBorder}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">{kpi.label}</span>
              <Icon
                className={`w-5 h-5 ${kpi.textColor} opacity-80 group-hover:opacity-100 transition-opacity`}
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
