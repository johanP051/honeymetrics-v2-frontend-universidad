import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js/lib/core';
import scatter from 'plotly.js/lib/scatter';
import pie from 'plotly.js/lib/pie';
import heatmap from 'plotly.js/lib/heatmap';

Plotly.register([scatter, pie, heatmap]);
const Plot = createPlotlyComponent(Plotly);

export const TimelineChart = ({ data }) => {
  const totalAlerts = data?.y?.reduce((sum, val) => sum + (Number(val) || 0), 0) || 0;
  const accessibleSummary = `Gráfico de línea temporal de histórico de ataques. Muestra ${data?.x?.length || 0} puntos temporales con un total aproximado de ${totalAlerts} alertas registradas.`;

  return (
    <figure role="region" aria-label="Histórico de Ataques (Timeline)" className="w-full h-full m-0 p-0 relative">
      <p className="sr-only">{accessibleSummary}</p>
      <Plot
        data={[{
          x: data?.x || [],
          y: data?.y || [],
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
    </figure>
  );
};

export const SeverityDonutChart = ({ data }) => {
  const plotRef = React.useRef(null);
  const numSlices = data?.labels?.length || 0;
  const breakdown = (data?.labels || []).map((label, idx) => `${label}: ${data?.values?.[idx] || 0}`).join(', ');
  const accessibleSummary = `Gráfico circular de distribución de ataques por severidad o categoría: ${breakdown || 'Sin datos disponibles'}.`;

  const handleHover = (eventData) => {
    const el = plotRef.current?.el || plotRef.current;
    const pointNumber = eventData?.points?.[0]?.pointNumber;
    if (el && pointNumber != null && numSlices > 0) {
      const pullArray = Array(numSlices).fill(0);
      pullArray[pointNumber] = 0.14;
      Plotly.restyle(el, { pull: [pullArray] });
    }
  };

  const handleUnhover = () => {
    const el = plotRef.current?.el || plotRef.current;
    if (el && numSlices > 0) {
      Plotly.restyle(el, { pull: [Array(numSlices).fill(0)] });
    }
  };

  return (
    <figure role="region" aria-label="Distribución de Ataques por Severidad" className="w-full h-full m-0 p-0 relative">
      <p className="sr-only">{accessibleSummary}</p>
      <Plot
        ref={plotRef}
        data={[{
          values: data?.values || [],
          labels: data?.labels || [],
          type: 'pie',
          hole: 0.55,
          marker: {
            colors: ['#f87171', '#f59e0b', '#10b981', '#38bdf8', '#94a3b8'],
            line: { color: '#0f172a', width: 2 }
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
        onHover={handleHover}
        onUnhover={handleUnhover}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </figure>
  );
};

export const PredictiveHeatmap = ({ data }) => {
  const colorscale = [
    [0.0, '#0d1117'],
    [0.15, '#162032'],
    [0.4, '#4b8bbf'],
    [0.7, '#d4af37'],
    [1.0, '#d06b62'],
  ];

  const accessibleSummary = 'Mapa de calor predictivo de volumen de ataques distribuido por hora del día (UTC) y día de la semana.';

  return (
    <figure role="region" aria-label="Mapa de Calor Predictivo de Alertas" className="w-full min-w-0 h-full overflow-hidden m-0 p-0 relative">
      <p className="sr-only">{accessibleSummary}</p>
      <Plot
        data={[{
          z: data?.matrix || [],
          x: data?.hours || Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
          y: data?.days || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          type: 'heatmap',
          colorscale: colorscale,
          showscale: true,
          colorbar: {
            title: { text: 'Alertas', font: { color: '#e6edf3', size: 12 } },
            tickfont: { color: '#9aa3ad', size: 10 },
            outlinecolor: 'transparent',
            bordercolor: 'transparent',
            len: 0.85,
            thickness: 10,
          },
          hoverongaps: false,
          hovertemplate: '<b>Día:</b> %{y}<br><b>Hora:</b> %{x} UTC<br><b>Volumen Estimado:</b> %{z} alertas<extra></extra>',
        }]}
        layout={{
          margin: { l: 45, r: 20, t: 20, b: 98 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { color: '#e6edf3', family: 'var(--font-sans, inherit)' },
          xaxis: {
            title: { text: 'Hora del Día (UTC)', standoff: 16, font: { size: 12, color: '#9aa3ad' } },
            showgrid: false,
            zeroline: false,
            showline: false,
            tickfont: { color: '#9aa3ad', size: 10 },
            dtick: 4,
            tickangle: -45,
            automargin: true,
          },
          yaxis: {
            title: { text: 'Día de la Semana', font: { size: 12, color: '#9aa3ad' } },
            showgrid: false,
            zeroline: false,
            showline: false,
            tickfont: { color: '#e6edf3', size: 12, weight: 'bold' },
            autorange: 'reversed',
          },
          autosize: true,
        }}
        config={{ responsive: true, displaylogo: false }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </figure>
  );
};
