import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import Box from '@mui/material/Box';
import ChartExportButton from './ChartExportButton';

const attackProportions = [
  { id: 'Fuerza Bruta', label: 'Fuerza Bruta', ratio: 0.528, color: '#f87171' },
  { id: 'Scanner', label: 'Scanner', ratio: 0.282, color: '#f59e0b' },
  { id: 'SQLi', label: 'SQLi', ratio: 0.148, color: '#10b981' },
  { id: 'DDoS', label: 'DDoS', ratio: 0.035, color: '#38bdf8' },
  { id: 'Malware', label: 'Malware', ratio: 0.007, color: '#94a3b8' },
];

function TitanicPie({ totalEvents = 165247 }) {
  const chartRef = React.useRef(null);
  const innerRadius = 48;
  const outerRadius = 85;

  const { attackData, totalCount } = React.useMemo(() => {
    const total = totalEvents > 0 ? totalEvents : 1000;
    let running = 0;
    const data = attackProportions.map((item, idx) => {
      const val = idx === attackProportions.length - 1
        ? Math.max(1, total - running)
        : Math.max(1, Math.round(total * item.ratio));
      running += val;
      return {
        id: item.id,
        label: item.label,
        value: val,
        color: item.color,
      };
    });
    const computedTotal = data.reduce((acc, item) => acc + item.value, 0);
    return {
      attackData: data.map((item) => ({
        ...item,
        percentage: computedTotal > 0 ? Number(((item.value / computedTotal) * 100).toFixed(1)) : 0,
      })),
      totalCount: computedTotal,
    };
  }, [totalEvents]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base font-display font-semibold text-slate-200">
            Vectores de Ataque
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Distribución porcentual por tipología de amenaza detectada.
          </p>
        </div>
        <ChartExportButton containerRef={chartRef} filename="vectores-de-ataque.png" />
      </div>
      <Box ref={chartRef} sx={{ display: 'flex', justifyContent: 'center', height: 320, width: '100%' }}>
        <PieChart
          series={[
            {
              innerRadius,
              outerRadius,
              data: attackData,
              arcLabel: (item) => {
                const pct = totalCount > 0 ? ((item.value / totalCount) * 100) : 0;
                return pct >= 8 ? `${pct.toFixed(0)}%` : '';
              },
              arcLabelMinAngle: 20,
              valueFormatter: (item) => {
                const val = Number(item?.value ?? item ?? 0);
                const pct = totalCount > 0 ? ((val / totalCount) * 100).toFixed(1) : '0.0';
                return `${val.toLocaleString()} ataques (${pct}%)`;
              },
              highlightScope: { fade: 'global', highlight: 'item' },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
            },
          ]}
          sx={{
            width: '100%',
            '& .MuiChartsLegend-label': {
              fill: '#cbd5e1',
              color: '#cbd5e1',
              fontSize: '12px !important',
            },
            '& .MuiPieArcLabel-root': {
              fill: '#f8fafc',
              fontSize: '11px',
              fontWeight: 700,
            },
          }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
            },
            popper: {
              sx: {
                zIndex: 9999,
                '& .MuiChartsTooltip-paper': {
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                },
                '& .MuiChartsTooltip-cell': {
                  color: '#f8fafc',
                },
              },
            },
          }}
          margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
        >
          <ChartsTooltip />
        </PieChart>
      </Box>
    </div>
  );
}

export default TitanicPie;