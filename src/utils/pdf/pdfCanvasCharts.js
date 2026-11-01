export const COLORES_GRAFICA = ['#CDA544', '#323232', '#8995A2', '#4189BC', '#D16D61', '#48A87D'];

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

export function crearGraficaDonut(values) {
  try {
    const canvas = document.createElement('canvas');
    const tamano = 620;
    canvas.width = tamano;
    canvas.height = tamano;
    const contexto = canvas.getContext('2d');
    if (!contexto) return null;

    const total = values.reduce((acumulado, valor) => acumulado + Number(valor || 0), 0) || 1;
    const centro = tamano / 2;
    let anguloInicio = -Math.PI / 2;

    contexto.fillStyle = '#FFFFFF';
    contexto.fillRect(0, 0, tamano, tamano);

    values.forEach((valor, indice) => {
      const porcentaje = Number(valor || 0) / total;
      const anguloFinal = anguloInicio + porcentaje * Math.PI * 2;

      contexto.beginPath();
      contexto.arc(centro, centro, 190, anguloInicio, anguloFinal);
      contexto.arc(centro, centro, 112, anguloFinal, anguloInicio, true);
      contexto.closePath();
      contexto.fillStyle = COLORES_GRAFICA[indice % COLORES_GRAFICA.length];
      contexto.fill();

      if (porcentaje >= 0.05) {
        const anguloTexto = (anguloInicio + anguloFinal) / 2;
        contexto.fillStyle = '#FFFFFF';
        contexto.font = 'bold 24px Arial';
        contexto.textAlign = 'center';
        contexto.textBaseline = 'middle';
        contexto.fillText(
          `${(porcentaje * 100).toFixed(1)}%`,
          centro + Math.cos(anguloTexto) * 151,
          centro + Math.sin(anguloTexto) * 151
        );
      }

      anguloInicio = anguloFinal;
    });

    contexto.fillStyle = '#20242A';
    contexto.font = 'bold 28px Arial';
    contexto.textAlign = 'center';
    contexto.fillText('TOTAL', centro, centro - 16);
    contexto.font = 'bold 38px Arial';
    contexto.fillText(String(total), centro, centro + 28);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Error al generar donut chart:', err);
    return null;
  }
}
