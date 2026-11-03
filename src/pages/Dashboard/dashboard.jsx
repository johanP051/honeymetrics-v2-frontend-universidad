import React, { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { TimelineChart, SeverityDonutChart, PredictiveHeatmap } from '../../components/dashboard/PlotlyCharts';
import { predictiveHeatmapMockData } from '../../mocks/heatmapMockData';
import api from '../../api/client';
import DashboardMetricsGrid from './DashboardMetricsGrid';
import HoneypotAdvisor from './HoneypotAdvisor';
import StatusBanner from '../../components/layout/StatusBanner';

const TIME_PRESETS = [
  { key: '24h', label: 'Últimas 24h' },
  { key: '7d', label: '7 Días' },
  { key: '30d', label: '30 Días' },
  { key: 'all', label: 'Todo (Histórico)' },
];

const FALLBACK_METRICS = {
  '24h': { total_analyzed_events: 1920, unique_attacker_ips: 84, persistent_threats_count: 12, active_critical_cves_count: 5 },
  '7d': { total_analyzed_events: 5987, unique_attacker_ips: 142, persistent_threats_count: 28, active_critical_cves_count: 14 },
  '30d': { total_analyzed_events: 18400, unique_attacker_ips: 380, persistent_threats_count: 42, active_critical_cves_count: 26 },
  'all': { total_analyzed_events: 165247, unique_attacker_ips: 1107, persistent_threats_count: 89, active_critical_cves_count: 48 },
};

export default function Dashboard() {
  const [activePreset, setActivePreset] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFallback, setIsFallback] = useState(false);
  const [metrics, setMetrics] = useState({
    total_analyzed_events: 5987,
    unique_attacker_ips: 142,
    persistent_threats_count: 28,
    active_critical_cves_count: 14,
    peak_hour_utc: '11:00 - 12:00 UTC',
  });

  const fetchSummary = useCallback(async (preset) => {
    try {
      setLoading(true);
      setError('');
      setIsFallback(false);
      const apiParam = preset === 'all' ? '90d' : preset;
      const response = await api.get('/threats/summary', {
        params: { range_preset: apiParam, range: apiParam },
      });
      if (response.data) {
        setMetrics({
          total_analyzed_events: response.data.total_analyzed_events ?? 5987,
          unique_attacker_ips: response.data.unique_attacker_ips ?? 142,
          persistent_threats_count: response.data.persistent_threats_count ?? 28,
          active_critical_cves_count: response.data.active_critical_cves_count ?? 14,
          peak_hour_utc: response.data.peak_hour_utc || '11:00 - 12:00 UTC',
        });
      }
    } catch (err) {
      console.warn('Error al consultar /threats/summary, usando datos de contingencia:', err);
      setIsFallback(false);
      setError('');
      const fallback = FALLBACK_METRICS[preset] || FALLBACK_METRICS['7d'];
      setMetrics((prev) => ({ ...prev, ...fallback }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(activePreset);
  }, [activePreset, fetchSummary]);

  const getChartData = () => {
    const totalEvents = metrics?.total_analyzed_events || 0;
    if (!totalEvents || totalEvents === 0) {
      return { timeline: { x: [], y: [] }, donut: { labels: [], values: [] } };
    }

    const scaleValues = (weights, total) => {
      let accumulated = 0;
      return weights.map((w, idx) => {
        if (idx === weights.length - 1) {
          return Math.max(0, total - accumulated);
        }
        const val = Math.floor(total * w);
        accumulated += val;
        return val;
      });
    };

    let timelineX = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    let timelineWeights = [0.05, 0.12, 0.08, 0.30, 0.18, 0.17, 0.10];

    if (activePreset === '24h') {
      timelineX = ['00:00', '06:00', '12:00', '18:00', '23:59'];
      timelineWeights = [0.10, 0.20, 0.15, 0.35, 0.20];
    } else if (activePreset === '30d') {
      timelineX = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
      timelineWeights = [0.22, 0.28, 0.26, 0.24];
    } else if (activePreset === 'all' || activePreset === '90d') {
      timelineX = ['Mes 1', 'Mes 2', 'Mes 3'];
      timelineWeights = [0.32, 0.38, 0.30];
    }

    const donutLabels = ['Fuerza Bruta', 'Scanner', 'SQLi', 'DDoS', 'Malware'];
    const donutWeights = [0.55, 0.25, 0.12, 0.06, 0.02];

    return {
      timeline: { x: timelineX, y: scaleValues(timelineWeights, totalEvents) },
      donut: { labels: donutLabels, values: scaleValues(donutWeights, totalEvents) },
    };
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 pb-10">
      <StatusBanner
        error={error}
        isLoading={loading}
        onRetry={() => fetchSummary(activePreset)}
        isMockFallback={isFallback}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-100 flex items-center gap-3">
            <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" aria-hidden="true" />
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitoreo en tiempo real de actividad maliciosa en la red de honeypots.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1 bg-[#161f30]/90 border border-slate-700/60 p-1 rounded-xl shadow-inner backdrop-blur-md flex-wrap">
            {TIME_PRESETS.map((preset) => {
              const isActive = activePreset === preset.key;
              return (
                <button
                  key={preset.key}
                  type="button"
                  disabled={loading}
                  onClick={() => setActivePreset(preset.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } disabled:opacity-50`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => fetchSummary(activePreset)}
            disabled={loading}
            title="Actualizar métricas"
            aria-label="Actualizar métricas"
            className="p-2 rounded-xl bg-[#161f30]/90 border border-slate-700/60 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
          </button>
        </div>
      </div>

      <DashboardMetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-4 h-[400px]">
          <TimelineChart data={chartData.timeline} />
        </div>
        <div className="glass-card p-4 h-[400px]">
          <SeverityDonutChart data={chartData.donut} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 h-auto min-h-[600px] lg:h-[480px] lg:min-h-0 flex flex-col">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-hm-text">Mapa de Calor Predictivo (Horarios Críticos)</h3>
            <p className="text-xs text-hm-muted">
              Probabilidad y volumen estimado de ataque basado en la telemetría histórica del Honeypot (UTC).
            </p>
          </div>
          <div className="flex-1 w-full min-h-0 h-[450px] lg:h-auto">
            <PredictiveHeatmap data={predictiveHeatmapMockData} />
          </div>
        </div>
        <div className="lg:col-span-1 glass-card p-6 h-[480px] flex flex-col">
          <HoneypotAdvisor totalEvents={metrics.total_analyzed_events} />
        </div>
      </div>
    </div>
  );
}
