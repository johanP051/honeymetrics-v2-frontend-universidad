import React from 'react';
import { Activity, ShieldCheck, AlertOctagon, TrendingUp } from 'lucide-react';

export default function DashboardMock() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-hm-text">Operational Dashboard</h2>
          <p className="text-hm-muted">Monitoreo de telemetría del Honeypot</p>
        </div>
        <select className="bg-hm-bg border border-hm-border text-hm-text px-4 py-2 rounded focus:outline-none focus:border-hm-gold">
          <option>Últimas 24 horas</option>
          <option>Últimos 7 días</option>
          <option>Último mes</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Alertas', value: '14,203', icon: Activity, color: 'text-hm-info' },
          { label: 'Severidad Promedio', value: '4.8', icon: AlertOctagon, color: 'text-hm-danger' },
          { label: 'IPs Bloqueadas', value: '3,812', icon: ShieldCheck, color: 'text-hm-success' },
          { label: 'Tasa de Ataque', value: '85/hr', icon: TrendingUp, color: 'text-hm-gold' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-hm-card p-6 rounded-lg border border-hm-border hover:border-hm-gold/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-hm-muted font-medium">{kpi.label}</h3>
              <kpi.icon className={kpi.color} size={24} />
            </div>
            <p className="text-3xl font-bold text-hm-text">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Gráficos Placeholders */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-hm-card p-6 rounded-lg border border-hm-border h-80 flex flex-col">
          <h3 className="text-hm-text font-bold mb-4">Top 10 Reglas Disparadas (Placeholder Pie)</h3>
          <div className="flex-1 border border-dashed border-hm-border rounded flex items-center justify-center text-hm-muted">
            [ Espacio para Recharts / Tremor: Donut Chart ]
          </div>
        </div>
        <div className="bg-hm-card p-6 rounded-lg border border-hm-border h-80 flex flex-col">
          <h3 className="text-hm-text font-bold mb-4">Histórico Temporal (Placeholder Spline)</h3>
          <div className="flex-1 border border-dashed border-hm-border rounded flex items-center justify-center text-hm-muted">
            [ Espacio para Recharts / Tremor: Area Chart ]
          </div>
        </div>
      </div>
    </div>
  );
}
