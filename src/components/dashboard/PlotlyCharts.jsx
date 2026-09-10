import React from 'react';
import Plot from 'react-plotly.js';

export const TimelineChart = ({ data }) => {
  return (
    <Plot
      data={[{
        x: data.x,
        y: data.y,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Alertas',
        line: { shape: 'spline', color: '#4b8bbf', width: 3 },
        fill: 'tozeroy',
        fillcolor: 'rgba(75, 139, 191, 0.2)',
        marker: { size: 6, color: '#d4af37' }
      }]}
      layout={{
        title: { text: 'Histórico de Ataques (Timeline)', font: { size: 16 } },
        xaxis: { title: 'Fecha', gridcolor: '#2a3440', showgrid: true },
        yaxis: { title: 'Cantidad de Alertas', gridcolor: '#2a3440', showgrid: true },
        margin: { l: 50, r: 20, t: 50, b: 50 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#e6edf3' },
        autosize: true
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export const SeverityDonutChart = ({ data }) => {
  return (
    <Plot
      data={[{
        values: data.values,
        labels: data.labels,
        type: 'pie',
        hole: 0.5,
        marker: {
          colors: ['#d06b62', '#c9a85a', '#3aa76d', '#4b8bbf', '#9aa3ad'],
          line: { color: '#161b22', width: 2 }
        },
        textinfo: 'percent',
        hoverinfo: 'label+value+percent'
      }]}
      layout={{
        title: { text: 'Distribución de Ataques', font: { size: 16 } },
        margin: { l: 20, r: 20, t: 50, b: 20 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#e6edf3' },
        autosize: true,
        showlegend: true,
        legend: { orientation: 'h', y: -0.1 }
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export const PredictiveHeatmap = ({ data }) => {
  // Escala de colores Dark Theme:
  // De azul muy oscuro (#0d1117 / #162032) -> hm-info (#4b8bbf) -> hm-gold (#d4af37) -> hm-danger (#d06b62)
  const colorscale = [
    [0.0, '#0d1117'],
    [0.15, '#162032'],
    [0.4, '#4b8bbf'],
    [0.7, '#d4af37'],
    [1.0, '#d06b62'],
  ];

  return (
    <Plot
      data={[{
        z: data.matrix,
        x: data.hours || Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
        y: data.days || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        type: 'heatmap',
        colorscale: colorscale,
        showscale: true,
        colorbar: {
          title: { text: 'Alertas', font: { color: '#e6edf3', size: 12 } },
          tickfont: { color: '#9aa3ad', size: 10 },
          outlinecolor: 'transparent',
          bordercolor: 'transparent',
          len: 0.9,
          thickness: 14,
        },
        hoverongaps: false,
        hovertemplate: '<b>Día:</b> %{y}<br><b>Hora:</b> %{x} UTC<br><b>Volumen Estimado:</b> %{z} alertas<extra></extra>',
      }]}
      layout={{
        margin: { l: 50, r: 40, t: 30, b: 40 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#e6edf3', family: 'var(--font-sans, inherit)' },
        xaxis: {
          title: { text: 'Hora del Día (UTC)', font: { size: 12, color: '#9aa3ad' } },
          showgrid: false,
          zeroline: false,
          showline: false,
          tickfont: { color: '#9aa3ad', size: 11 },
          tickangle: 0,
        },
        yaxis: {
          title: { text: 'Día de la Semana', font: { size: 12, color: '#9aa3ad' } },
          showgrid: false,
          zeroline: false,
          showline: false,
          tickfont: { color: '#e6edf3', size: 12, weight: 'bold' },
          autorange: 'reversed', // Lunes arriba, Domingo abajo
        },
        autosize: true,
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
