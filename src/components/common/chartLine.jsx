import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from '../dataset/weather';
import ChartExportButton from './ChartExportButton';

function LineMarkShape({ totalEvents = 165247 }) {
  const chartRef = React.useRef(null);
  const scaledDataset = React.useMemo(() => {
    const baseSum = dataset.reduce((acc, row) => acc + (row.london || 0), 0) || 1;
    return dataset.map((row) => ({
      ...row,
      london: Math.round(((row.london || 0) / baseSum) * (totalEvents || 165247)),
    }));
  }, [totalEvents]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base font-display font-semibold text-slate-200">
            Tendencia de Tráfico Malicioso
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Evolución temporal del volumen de eventos detectados.
          </p>
        </div>
        <ChartExportButton containerRef={chartRef} filename="tendencia-trafico-malicioso.png" />
      </div>
      <Box ref={chartRef} sx={{ flexGrow: 1, minWidth: 0, width: '100%', overflow: 'hidden' }}>
        <LineChart
          height={320}
          dataset={scaledDataset}
          series={[
            {
              dataKey: 'london',
              label: 'Ataques detectados',
              valueFormatter: (v) => `${Number(v ?? 0).toLocaleString()} ataques`,
              curve: 'natural',
              showMark: true,
              shape: 'circle',
              color: '#38bdf8',
            },
          ]}
          xAxis={[{ scaleType: 'point', dataKey: 'month' }]}
          grid={{ vertical: true, horizontal: true }}
          slotProps={{
            popper: {
              sx: {
                zIndex: 9999,
                '& .MuiChartsTooltip-paper': {
                  backgroundColor: '#161b22',
                  color: '#e6edf3',
                  border: '1px solid #2a3440',
                },
                '& .MuiChartsTooltip-cell': {
                  color: '#e6edf3',
                },
              },
            },
          }}
          sx={{
            width: '100%',
            maxWidth: '100%',
            '& .MuiChartsAxis-line': {
              stroke: '#475569 !important',
            },
            '& .MuiChartsAxis-tick': {
              stroke: '#475569 !important',
            },
            '& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-label': {
              color: '#94a3b8 !important',
              fill: '#94a3b8 !important',
            },
            '& .MuiChartsGrid-line': {
              stroke: '#334155 !important',
              opacity: 0.4,
            },
            '& .MuiChartsLegend-label': {
              color: '#cbd5e1 !important',
              fill: '#cbd5e1 !important',
            },
            '& .MuiChartsLegend-mark': {
              display: 'none',
            },
          }}
        />
      </Box>
    </div>
  );
}

export default LineMarkShape;