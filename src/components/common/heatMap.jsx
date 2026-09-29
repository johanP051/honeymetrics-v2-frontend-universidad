import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';

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
  { position: 0, color: '#0D1218' },
  { position: 200, color: '#26415D' },
  { position: 400, color: '#588FB3' },
  { position: 600, color: '#BBA850' },
  { position: 850, color: '#D17C57' },
  { position: 920, color: '#D16D61' },
];

function interpolateColor(normalizedValue) {
  const value = Math.max(0, Math.min(normalizedValue, 1)) * 920;
  const clampedValue = Math.max(0, Math.min(value, 920));
  const nextStopIndex = colorStops.findIndex((stop) => stop.position >= clampedValue);

  if (nextStopIndex <= 0) {
    return colorStops[0].color;
  }

  const previousStop = colorStops[nextStopIndex - 1];
  const nextStop = colorStops[nextStopIndex];
  const progress =
    (clampedValue - previousStop.position) /
    (nextStop.position - previousStop.position);
  const previousRgb = previousStop.color.match(/[0-9a-f]{2}/gi).map((part) => parseInt(part, 16));
  const nextRgb = nextStop.color.match(/[0-9a-f]{2}/gi).map((part) => parseInt(part, 16));
  const rgb = previousRgb.map((channel, index) =>
    Math.round(channel + (nextRgb[index] - channel) * progress),
  );

  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function ColorConfig() {
  return (
    <Stack className="heatmapContainer" sx={{ width: '100%', color: '#D7DCE5' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
        Mapa de Calor Predictivo (Horarios Críticos)
      </Typography>
      <Typography variant="body2" sx={{ color: '#8E98A8', mb: 2 }}>
        Probabilidad y volumen estimado de ataque basado en la telemetría histórica del Honeypot (UTC).
      </Typography>
      <Heatmap
        height={360}
        xAxis={[{ data: xData, label: 'Hora del Día (UTC)' }]}
        yAxis={[{ data: yData, width: 60, label: 'Día de la Semana' }]}
        series={[{
          data,
          highlightScope: { highlight: 'none', fade: 'none' },
        }]}
        zAxis={[
          {
            min: 0,
            max: 920,
            colorMap: {
              type: 'continuous',
              min: 0,
              max: 920,
              color: interpolateColor,
            },
          },
        ]}
        sx={{
          '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
            stroke: '#303846',
          },
          '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel, & .MuiChartsAxis-bottom .MuiChartsAxis-label': {
            fill: '#606771',
            color: '#606771',
          },
          '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel, & .MuiChartsAxis-left .MuiChartsAxis-label': {
            fill: '#FFFFFF',
            color: '#FFFFFF',
            fontWeight: 700,
          },
          '& .MuiChartsLegend-label': {
            fill: '#AAB3C0',
          },
          '& .MuiContinuousColorLegend-minLabel, & .MuiContinuousColorLegend-maxLabel': {
            color: '#FFFFFF',
            fill: '#FFFFFF',
          },
          '& .MuiChartsWatermark-root': {
            display: 'none !important',
          },
          '& div[style*="z-index: 100000"], & div[style*="letter-spacing: 5px"]': {
            display: 'none !important',
          },
        }}
      />
    </Stack>
  );
}

export default ColorConfig;