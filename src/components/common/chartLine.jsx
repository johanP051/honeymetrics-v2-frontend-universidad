import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from '../dataset/weather';

function LineMarkShape() {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%', minWidth: 0, padding: 2, boxSizing: 'border-box' }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%', overflow: 'hidden' }}>
        <LineChart
          height={250}
          dataset={dataset}
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