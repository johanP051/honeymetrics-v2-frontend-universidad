export const COLORES_GRAFICA = ['#CDA544', '#2E3846', '#4189BC', '#3AA76D', '#D16D61', '#8995A2'];

export function cargarImagenComoDataUrl(url) {
  return fetch(url)
    .then((respuesta) => respuesta.blob())
    .then((blob) => new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onloadend = () => resolve(lector.result);
      lector.onerror = reject;
      lector.readAsDataURL(blob);
    }))
    .catch((err) => {
      console.warn('No se pudo cargar la imagen para el PDF:', err);
      return null;
    });
}

export function crearGraficaBarrasHorizontales(values, labels = []) {
  try {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 540;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const total = values.reduce((acc, val) => acc + Number(val || 0), 0) || 1;
    const maxItems = Math.min(labels.length || values.length, 6);

    const startY = 30;
    const rowHeight = 80;
    const labelX = 14;
    const barStartX = 230;
    const maxBarWidth = 360;
    const barHeight = 22;

    for (let i = 0; i < maxItems; i += 1) {
      const y = startY + i * rowHeight;
      const rawVal = Number(values[i] || 0);
      const pct = (rawVal / total) * 100;
      const barW = Math.max((rawVal / total) * maxBarWidth, 4);
      const label = labels[i] || `Decoder ${i + 1}`;
      const isTop = i === 0;
      const barColor = isTop ? '#CDA544' : COLORES_GRAFICA[i % COLORES_GRAFICA.length];

      // Barra de fondo sutil
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(barStartX, y, maxBarWidth, barHeight, 6) : ctx.rect(barStartX, y, maxBarWidth, barHeight);
      ctx.fill();

      // Barra de valor coloreada proporcional al % real
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(barStartX, y, barW, barHeight, 6) : ctx.rect(barStartX, y, barW, barHeight);
      ctx.fill();

      // Nombre del decoder (hasta 22 caracteres sin truncamiento)
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 20px Helvetica, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const safeLabel = label.length > 22 ? `${label.slice(0, 21)}…` : label;
      ctx.fillText(safeLabel, labelX, y + 12);

      // Porcentaje y cantidad formateada a la derecha
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 20px Helvetica, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${pct.toFixed(1)}%`, barStartX + maxBarWidth + 14, y + 12);

      ctx.fillStyle = '#64748B';
      ctx.font = 'normal 18px Helvetica, Arial, sans-serif';
      ctx.fillText(`(${rawVal.toLocaleString('es-CO')})`, barStartX + maxBarWidth + 90, y + 12);
    }

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Error al generar horizontal bar chart:', err);
    return null;
  }
}

export function crearGraficaDonut(values, labels = []) {
  // Alias que delega al nuevo diseño de barras horizontales de alto rendimiento
  return crearGraficaBarrasHorizontales(values, labels);
}
