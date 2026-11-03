import React, { useCallback } from 'react';
import { Camera } from 'lucide-react';

export default function ChartExportButton({
  containerRef,
  filename = 'grafica-honeymetrics.png',
  title = 'Exportar PNG',
}) {
  const handleExport = useCallback(() => {
    const container = containerRef?.current;
    const svg = container?.querySelector('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const width = Math.round(rect.width) || 640;
    const height = Math.round(rect.height) || 360;

    const clone = svg.cloneNode(true);
    clone.setAttribute('width', String(width));
    clone.setAttribute('height', String(height));
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      text, tspan { fill: #e2e8f0 !important; font-family: ui-sans-serif, system-ui, sans-serif !important; }
      .MuiChartsAxis-line, .MuiChartsAxis-tick { stroke: #475569 !important; }
      .MuiChartsGrid-line { stroke: #334155 !important; opacity: 0.4; }
      .MuiChartsLegend-label { fill: #cbd5e1 !important; }
      .MuiPieArcLabel-root { fill: #f8fafc !important; font-weight: 700 !important; }
    `;
    clone.insertBefore(style, clone.firstChild);

    const serializer = new XMLSerializer();
    const blob = new Blob([serializer.serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' });
    const urlApi = window.URL || window.webkitURL;
    const blobUrl = urlApi.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#161f30';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      urlApi.revokeObjectURL(blobUrl);
    };
    img.onerror = () => urlApi.revokeObjectURL(blobUrl);
    img.src = blobUrl;
  }, [containerRef, filename]);

  return (
    <button
      type="button"
      onClick={handleExport}
      title={title}
      aria-label={title}
      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700/60 transition-colors shrink-0"
    >
      <Camera size={16} aria-hidden="true" />
    </button>
  );
}
