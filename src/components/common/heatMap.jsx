import React, { useRef, useState, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import ChartExportButton from './ChartExportButton';

const dataset = [
  { day: 'Lun', values: [0, 0, 0, 0, 0, 0, 0, 0, 171, 191, 420, 720, 860, 890, 920, 420, 220, 150, 0, 0, 0, 0, 0, 0] },
  { day: 'Mar', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 110, 390, 280, 100, 0, 0, 40, 80, 0, 0, 0, 0, 0, 0] },
  { day: 'Mié', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 180, 410, 300, 120, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0] },
  { day: 'Jue', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 100, 80, 0, 0, 0, 60, 120, 0, 0, 0, 0, 0, 0] },
  { day: 'Vie', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 80, 50, 0, 0, 0, 90, 140, 0, 0, 0, 0, 0, 0] },
  { day: 'Sáb', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 20, 0, 0, 0, 0, 0, 0] },
  { day: 'Dom', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
];

const xData = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);
const yData = dataset.map(({ day }) => day);
const data = dataset.flatMap(({ values }, dayIndex) =>
  values.map((value, hourIndex) => [hourIndex, dayIndex, value]),
);

const colorStops = [
  { position: 0, color: '#0D1218' }, { position: 200, color: '#26415D' },
  { position: 400, color: '#588FB3' }, { position: 600, color: '#BBA850' },
  { position: 850, color: '#D17C57' }, { position: 920, color: '#D16D61' },
];

function interpolateColor(normalizedValue) {
  const value = Math.max(0, Math.min(normalizedValue, 1)) * 920;
  const clampedValue = Math.max(0, Math.min(value, 920));
  const nextStopIndex = colorStops.findIndex((stop) => stop.position >= clampedValue);
  if (nextStopIndex <= 0) return colorStops[0].color;

  const previousStop = colorStops[nextStopIndex - 1];
  const nextStop = colorStops[nextStopIndex];
  const progress = (clampedValue - previousStop.position) / (nextStop.position - previousStop.position);
  const prevRgb = previousStop.color.match(/[0-9a-f]{2}/gi).map((p) => parseInt(p, 16));
  const nextRgb = nextStop.color.match(/[0-9a-f]{2}/gi).map((p) => parseInt(p, 16));
  const rgb = prevRgb.map((channel, i) => Math.round(channel + (nextRgb[i] - channel) * progress));
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

function ColorConfig() {
  const chartRef = useRef(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  const handleHighlight = useCallback((item) => {
    if (!item) {
      setHoveredCell(null);
      return;
    }
    const hIdx = item.xIndex ?? (item.dataIndex !== undefined ? data[item.dataIndex]?.[0] : undefined);
    const dIdx = item.yIndex ?? (item.dataIndex !== undefined ? data[item.dataIndex]?.[1] : undefined);
    if (hIdx !== undefined && dIdx !== undefined) {
      const day = yData[dIdx] || 'Día';
      const hour = `${String(hIdx).padStart(2, '0')}:00 UTC`;
      const count = dataset[dIdx]?.values[hIdx] ?? 0;
      const prob = ((count / 920) * 100).toFixed(1);
      setHoveredCell({ day, hour, count, prob });
    }
  }, []);

  return (
    <Stack className="heatmapContainer w-full" sx={{ width: '100%', color: '#D7DCE5' }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-base font-display font-semibold text-slate-200 break-words leading-snug pr-2">
            Mapa de Calor Predictivo (Probabilidad Horaria de Ataque)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Probabilidad y volumen estimado de ataque basado en la telemetría histórica del Honeypot (UTC).
          </p>
          <div className="mt-2 min-h-[24px]">
            {hoveredCell ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900/90 border border-amber-500/40 text-xs font-mono text-slate-200">
                <span className="text-amber-400 font-semibold">{hoveredCell.day}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{hoveredCell.hour}</span>
                <span className="text-slate-500">:</span>
                <span className="text-amber-300 font-semibold">{hoveredCell.count.toLocaleString()} alertas</span>
                <span className="text-slate-400">({hoveredCell.prob}% prob.)</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-500 font-mono">
                Pase el cursor sobre las celdas para ver el detalle horario
              </span>
            )}
          </div>
        </div>
        <ChartExportButton containerRef={chartRef} filename="mapa-calor-predictivo.png" />
      </div>

      <div ref={chartRef} className="w-full overflow-x-auto overflow-y-hidden pb-2">
        <div className="min-w-[620px] lg:min-w-full">
          <Heatmap
            height={360}
            margin={{ left: 75, right: 24, top: 20, bottom: 50 }}
            onHighlightChange={handleHighlight}
            xAxis={[{
              data: xData,
              label: 'Hora del Día (UTC)',
              valueFormatter: (val, ctx) => (ctx?.location === 'tooltip' ? `${val} UTC` : val),
            }]}
            yAxis={[{ data: yData, width: 60, label: 'Día de la Semana' }]}
            series={[{
              data,
              label: 'Alertas detectadas',
              valueFormatter: (value) => {
                const val = Number(value || 0);
                const prob = ((val / 920) * 100).toFixed(1);
                return `${val.toLocaleString()} alertas (${prob}% probabilidad)`;
              },
              highlightScope: { highlight: 'item', fade: 'global' },
            }]}
            zAxis={[{
              min: 0,
              max: 920,
              colorMap: { type: 'continuous', min: 0, max: 920, color: interpolateColor },
            }]}
            slotProps={{
              popper: {
                sx: {
                  zIndex: 9999,
                  '& .MuiChartsTooltip-paper': {
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    border: '1px solid #334155',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                  },
                  '& .MuiChartsTooltip-cell, & .MuiChartsTooltip-table': { color: '#f8fafc' },
                },
              },
            }}
            sx={{
              '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: '#303846' },
              '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel, & .MuiChartsAxis-bottom .MuiChartsAxis-label': {
                fill: '#94a3b8', color: '#94a3b8',
              },
              '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel, & .MuiChartsAxis-left .MuiChartsAxis-label': {
                fill: '#FFFFFF', color: '#FFFFFF', fontWeight: 700,
              },
              '& .MuiChartsLegend-label': { fill: '#AAB3C0' },
              '& .MuiContinuousColorLegend-minLabel, & .MuiContinuousColorLegend-maxLabel': {
                color: '#FFFFFF', fill: '#FFFFFF',
              },
              '& .MuiChartsWatermark-root, & div[style*="z-index: 100000"], & div[style*="letter-spacing: 5px"]': {
                display: 'none !important',
              },
            }}
          />
        </div>
      </div>
    </Stack>
  );
}

export default ColorConfig;