import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from '../dataset/weather';

function LineMarkShape({ totalEvents = 165247 }) {
  const scaledDataset = React.useMemo(() => {
    const baseSum = dataset.reduce((acc, row) => acc + (row.london || 0), 0) || 1;
    return dataset.map(row => ({
      ...row,
      london: Math.round(((row.london || 0) / baseSum) * (totalEvents || 165247)),
    }));
  }, [totalEvents]);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%', minWidth: 0, padding: 2, boxSizing: 'border-box' }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%', overflow: 'hidden' }}>
        <LineChart
          height={250}
          dataset={scaledDataset}
          series={[
            {
              dataKey: 'london',
              label: 'Histórico de ataques (Timeline)',
              curve: 'natural',
              showMark: true,
              shape: 'circle',
            },
          ]}
          xAxis={[{ scaleType: 'point', dataKey: 'month' }]}
          grid={{ vertical: true, horizontal: true }}
          sx={{
            width: '100%',
            maxWidth: '100%',
            '& .MuiChartsAxis-line': {
              stroke: '#FFFFFF !important',
            },
            '& .MuiChartsAxis-tick': {
              stroke: '#FFFFFF !important',
            },
            '& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-label': {
              color: '#FFFFFF !important',
              fill: '#FFFFFF !important',
            },
            '& .MuiChartsGrid-line': {
              stroke: '#FFFFFF !important',
              opacity: 0.2,
            },
            '& .MuiChartsLegend-label': {
              color: '#FFFFFF !important',
              fill: '#FFFFFF !important',
            },
            '& .MuiChartsLegend-mark': {
              display: 'none',
            },
          }}
        />
      </Box>
    </Stack>
  );
}

export default LineMarkShape;