import { PieChart } from '@mui/x-charts/PieChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const attackData = [
  { id: 'Fuerza Bruta', label: 'Fuerza Bruta', value: 528, color: '#e35d61' },
  { id: 'Scanner', label: 'Scanner', value: 282, color: '#d1b35d' },
  { id: 'SQLi', label: 'SQLi', value: 148, color: '#00b879' },
  { id: 'DDoS', label: 'DDoS', value: 35, color: '#4189bc' },
  { id: 'Malware', label: 'Malware', value: 7, color: '#9da7b5' },
];

const totalCount = attackData.reduce((acc, item) => acc + item.value, 0);

function TitanicPie() {
  const innerRadius = 60;
  const outerRadius = 125;

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
                `${value} (${((value / totalCount) * 100).toFixed(1)}%)`,
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