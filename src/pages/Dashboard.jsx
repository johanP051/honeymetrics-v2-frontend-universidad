import React from 'react';
import { Activity, ShieldCheck, AlertOctagon, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { TimelineChart, SeverityDonutChart, PredictiveHeatmap } from '../components/dashboard/PlotlyCharts';
import { predictiveHeatmapMockData } from '../mocks/heatmapMockData';
import HoneypotAdvisor from '../components/dashboard/HoneypotAdvisor';
import { useThreats } from '../hooks/useThreats';
import { StatusBanner } from '../components/layout/StatusBanner';
import TimeRangeFilter from '../components/dashboard/TimeRangeFilter';

export default function Dashboard() {
  const { data, loading, error, isMockFallback, filters, setFilters, refetch } = useThreats({ range: '7d' });

  // Mantenemos data adaptativa para los charts de Plotly hasta implementar el endpoint de series temporales completo
  const getChartData = () => {
    if (data?.total_analyzed_events === 0) {
      return {
        timeline: { x: [], y: [] },
        donut: { labels: [], values: [] },
      };
    }

    if (filters.range === '24h') {
      return {
        timeline: { x: ['00:00', '06:00', '12:00', '18:00', '23:59'], y: [120, 350, 200, 800, 450] },
        donut: { labels: ['Fuerza Bruta', 'Scanner', 'SQLi'], values: [500, 1000, 420] }
      };
    }

    if (filters.range === '30d') {
      return {
        timeline: { x: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'], y: [18000, 24000, 21500, 20700] },
        donut: { labels: ['Fuerza Bruta', 'Scanner', 'SQLi', 'DDoS', 'Malware'], values: [42000, 21000, 12000, 7200, 2000] }
      };
    }

    if (filters.range === '90d') {
      return {
        timeline: { x: ['Mes 1', 'Mes 2', 'Mes 3'], y: [45000, 52000, 45000] },
        donut: { labels: ['Fuerza Bruta', 'Scanner', 'SQLi', 'DDoS', 'Malware'], values: [75000, 35000, 18000, 11000, 3000] }
      };
    }

    // Default 7d o Custom con datos
    return {
      timeline: { x: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], y: [1200, 3500, 2000, 8000, 4500, 6000, 3200] },
      donut: { labels: ['Fuerza Bruta', 'Scanner', 'SQLi', 'DDoS', 'Malware'], values: [15000, 8000, 4200, 1000, 200] }
    };
  };

  const chartData = getChartData();
  const hasNoData = data?.total_analyzed_events === 0;

  const kpis = [
    { 
      label: 'Eventos Analizados', 
      value: data?.total_analyzed_events != null ? data.total_analyzed_events.toLocaleString() : '0', 
      icon: Activity, 
      color: 'text-hm-info' 
    },
    { 
      label: 'IPs Atacantes', 
      value: data?.unique_attacker_ips != null ? data.unique_attacker_ips.toLocaleString() : '0', 
      icon: TrendingUp, 
      color: 'text-hm-gold' 
    },
    { 
      label: 'Amenazas Persistentes', 
      value: data?.persistent_threats_count != null ? data.persistent_threats_count.toString() : '0', 
      icon: AlertOctagon, 
      color: 'text-hm-danger' 
    },
    { 
      label: 'CVEs Activos', 
      value: data?.active_critical_cves_count != null ? data.active_critical_cves_count.toLocaleString() : '0', 
      icon: ShieldCheck, 
      color: 'text-hm-success' 
    },
  ];

  return (
    <div className="animate-fade-up pb-10">
      {/* Banner de Conectividad con Motor CTI */}
      <StatusBanner error={error} isLoading={loading} onRetry={refetch} isMockFallback={isMockFallback} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-hm-gold flex items-center gap-3">
            <Activity size={32} />
            Dashboard
          </h1>
          <p className="text-hm-muted mt-2">Monitoreo de telemetría e indicadores del Honeypot (CTI).</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={refetch}
            disabled={loading}
            title="Recargar métricas"
            className="p-2 rounded-xl bg-hm-card border border-hm-border text-hm-muted hover:text-hm-gold hover:border-hm-gold transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <TimeRangeFilter
            filters={filters}
            onChange={setFilters}
            disabled={loading}
          />
        </div>
      </div>

      {loading && !data ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-hm-border border-t-hm-gold rounded-full animate-spin mb-4"></div>
          <p className="text-hm-gold animate-pulse">Sincronizando métricas con el motor CTI...</p>
        </div>
      ) : (
        <>
          {/* Criterio BDD PB-HM-27.1 Escenario 2: Mensaje amigable cuando no hay datos */}
          {hasNoData && (
            <div className="glass-card p-6 mb-8 border border-hm-gold/30 bg-hm-gold/5 flex items-center gap-4 rounded-xl">
              <AlertCircle size={24} className="text-hm-gold shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-hm-gold">No hay datos disponibles para el rango seleccionado</h4>
                <p className="text-xs text-hm-muted mt-1">
                  El período especificado no contiene registros de telemetría en el dataset del Honeypot (Abril - Agosto 2026). Pruebe seleccionando otra ventana temporal.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="glass-card p-6 border-t-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-shadow" style={{ borderTopColor: 'currentColor' }}>
                <div className={`flex justify-between items-start mb-4 ${kpi.color}`}>
                  <h3 className="text-hm-text font-medium">{kpi.label}</h3>
                  <kpi.icon size={24} />
                </div>
                <p className={`text-4xl font-display font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4 h-[400px]">
              <TimelineChart data={chartData.timeline} />
            </div>
            <div className="glass-card p-4 h-[400px]">
              <SeverityDonutChart data={chartData.donut} />
            </div>
          </div>

          {/* Fila Inferior: Heatmap Predictivo (2 cols) + Honeypot Advisor (1 col) - PB-HM-65 / PB-HM-70 */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Heatmap de Riesgo Predictivo (lg:col-span-2) */}
            <div className="lg:col-span-2 glass-card p-6 h-[480px] flex flex-col">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-hm-text">Mapa de Calor Predictivo (Horarios Críticos)</h3>
                <p className="text-xs text-hm-muted">
                  Probabilidad y volumen estimado de ataque basado en la telemetría histórica del Honeypot (UTC).
                </p>
              </div>
              <div className="flex-1 w-full min-h-0">
                <PredictiveHeatmap data={predictiveHeatmapMockData} />
              </div>
            </div>

            {/* Honeypot Advisor (lg:col-span-1) */}
            <div className="lg:col-span-1 glass-card p-6 h-[480px]">
              <HoneypotAdvisor />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

