import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const attackProportions = [
  { id: 'Fuerza Bruta', label: 'Fuerza Bruta', ratio: 0.528, color: '#e35d61' },
  { id: 'Scanner', label: 'Scanner', ratio: 0.282, color: '#d1b35d' },
  { id: 'SQLi', label: 'SQLi', ratio: 0.148, color: '#00b879' },
  { id: 'DDoS', label: 'DDoS', ratio: 0.035, color: '#4189bc' },
  { id: 'Malware', label: 'Malware', ratio: 0.007, color: '#9da7b5' },
];

function TitanicPie({ totalEvents = 165247 }) {
  const innerRadius = 60;
  const outerRadius = 125;

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
    return { attackData: data, totalCount: computedTotal };
  }, [totalEvents]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Distribución de ataques
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: 400 }}>
        <PieChart
          series={[
            {
              innerRadius,
              outerRadius,
              data: attackData,
              valueFormatter: ({ value }) =>
                `${Number(value).toLocaleString('es-CO')} (${((value / totalCount) * 100).toFixed(1)}%)`,
              highlightScope: { fade: 'global', highlight: 'item' },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
            },
          ]}
          sx={{
            '& .MuiChartsLegend-label': {
              fill: '#fff',
              color: '#fff',
            },
          }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'left' },
              padding: 0,
            },
          }}
          margin={{ top: 20, bottom: 70, left: 40, right: 40 }}
        >
          <ChartsTooltip />
        </PieChart>
      </Box>
    </Box>
  );
}

export default TitanicPie;