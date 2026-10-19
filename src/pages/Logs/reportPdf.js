import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoHoneyMetrics from '../../assets/HoneyMetrics_logo_circled.png';

const CAMPOS_ESQUEMA = [
  ['1. METADATOS Y CORE', '', ''],
  ['@timestamp', 'String (ISO 8601)', 'Momento exacto del evento. Permite extraer hora, día de semana y mes.'],
  ['id', 'String', 'Identificador único; úselo para limpieza y deduplicación.'],
  ['decoder.name', 'String', 'Decoder Wazuh que procesó el evento; variable categórica principal.'],
  ['location', 'String', 'Origen del log, por ejemplo journald o logcollector.'],
  ['full_log', 'String (texto)', 'Log crudo útil para análisis y modelos NLP.'],
  ['2. ACTIVOS Y AGENTES', '', ''],
  ['agent.id / agent.name', 'String', 'Identificación del honeypot para cruces y perfilado por servidor.'],
  ['agent.ip', 'String (IPv4/IPv6)', 'Dirección IP del agente para correlación de red.'],
  ['3. REGLAS E INTELIGENCIA', '', ''],
  ['rule.id', 'String / Entero', 'Firma de la alerta; útil para clasificación.'],
  ['rule.level', 'Entero (1-16)', 'Severidad ordinal de la alerta.'],
  ['rule.description', 'String', 'Descripción humana para agrupación temática.'],
  ['rule.mitre.tactic', 'Array[String]', 'Fase MITRE ATT&CK asociada a la actividad.'],
  ['rule.mitre.technique', 'Array[String]', 'Técnica MITRE detectada.'],
  ['4. INTEGRIDAD Y ANOMALÍAS', '', ''],
  ['syscheck.path / event', 'String', 'Archivo modificado y tipo de cambio detectado.'],
  ['data.file / data.title', 'String', 'Artefacto y clasificación de anomalías o rootkits.'],
];

const COLORES_GRAFICA = ['#CDA544', '#323232', '#8995A2', '#4189BC', '#D16D61', '#48A87D'];

function cargarImagenComoDataUrl(url) {
  return fetch(url)
    .then((respuesta) => respuesta.blob())
    .then((blob) => new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onloadend = () => resolve(lector.result);
      lector.onerror = reject;
      lector.readAsDataURL(blob);
    }));
}

function crearGraficaDonut(values) {
  const canvas = document.createElement('canvas');
  const tamano = 620;
  canvas.width = tamano;
  canvas.height = tamano;
  const contexto = canvas.getContext('2d');
  const total = values.reduce((acumulado, valor) => acumulado + Number(valor || 0), 0);
  const centro = tamano / 2;
  let anguloInicio = -Math.PI / 2;

  contexto.fillStyle = '#FFFFFF';
  contexto.fillRect(0, 0, tamano, tamano);

  values.forEach((valor, indice) => {
    const porcentaje = total ? Number(valor) / total : 0;
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
      contexto.fillText(`${(porcentaje * 100).toFixed(1)}%`, centro + Math.cos(anguloTexto) * 151, centro + Math.sin(anguloTexto) * 151);
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
}

function agregarPieDePagina(documento) {
  const totalPaginas = documento.getNumberOfPages();

  for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
    documento.setPage(pagina);
    documento.setDrawColor(210, 210, 210);
    documento.line(14, 286, 196, 286);
    documento.setFontSize(8);
    documento.setTextColor(135, 135, 135);
    documento.text('Confidencial - Reporte autogenerado | HoneyMetrics', 14, 291);
    documento.text(`Página ${pagina} de ${totalPaginas}`, 196, 291, { align: 'right' });
  }
}

export async function generarReportePdf(exportId, estadisticas) {
  const { labels = [], values = [], total_logs: totalLogs = 0, start_date: fechaInicio, end_date: fechaFin } = estadisticas;
  const totalDistribucion = values.reduce((acumulado, valor) => acumulado + Number(valor || 0), 0);
  const documento = new jsPDF({ format: 'a4', unit: 'mm' });
  const fechaGeneracion = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
  const [logo, grafica] = await Promise.all([
    cargarImagenComoDataUrl(logoHoneyMetrics),
    Promise.resolve(crearGraficaDonut(values)),
  ]);
  const indicePrincipal = values.reduce((indiceMayor, valor, indice, arreglo) => (
    Number(valor) > Number(arreglo[indiceMayor]) ? indice : indiceMayor
  ), 0);
  const decoderPrincipal = labels[indicePrincipal] || 'sin clasificación';

  documento.setFillColor(205, 165, 68);
  documento.rect(0, 0, 210, 8, 'F');
  documento.addImage(logo, 'PNG', 14, 14, 18, 18);
  documento.setTextColor(32, 36, 42);
  documento.setFont('helvetica', 'bold');
  documento.setFontSize(23);
  documento.text('Reporte técnico de telemetría', 36, 23);
  documento.setFont('helvetica', 'normal');
  documento.setTextColor(95, 95, 95);
  documento.setFontSize(12);
  documento.text('Resumen de exportación y distribución por decoder', 36, 30);
  documento.setTextColor(32, 36, 42);
  documento.setFontSize(10);
  documento.text(`ID Solicitud: #${exportId}`, 196, 21, { align: 'right' });
  documento.text(`Generado: ${fechaGeneracion}`, 196, 28, { align: 'right' });
  documento.setDrawColor(205, 205, 205);
  documento.line(14, 40, 196, 40);

  documento.setFont('helvetica', 'bold');
  documento.setFontSize(15);
  documento.text('Resumen ejecutivo', 14, 53);
  documento.setFont('helvetica', 'normal');
  documento.setFontSize(10.5);
  documento.setTextColor(50, 50, 50);
  documento.text(documento.splitTextToSize('Este reporte resume la telemetría extraída del Honeypot. La distribución permite identificar los decoders predominantes y priorizar su análisis técnico.', 80), 14, 61);
  documento.setFont('helvetica', 'bold');
  documento.setTextColor(20, 20, 20);
  documento.text('Total de logs extraídos:', 14, 91);
  documento.text('Rango de fechas:', 14, 100);
  documento.setFont('helvetica', 'normal');
  documento.text(String(totalLogs), 58, 91);
  documento.text(`${fechaInicio} a ${fechaFin}`, 48, 100);
  documento.setTextColor(205, 165, 68);
  documento.setFont('helvetica', 'bold');
  documento.text('Hallazgo principal:', 14, 116);
  documento.setFont('helvetica', 'normal');
  documento.text(documento.splitTextToSize(`El decoder con mayor presencia es ${decoderPrincipal}. Prioriza la revisión de sus eventos y sus campos asociados.`, 82), 14, 123);

  documento.setTextColor(20, 20, 20);
  documento.setFont('helvetica', 'bold');
  documento.setFontSize(15);
  documento.text('Eventos por decoder', 124, 53);
  documento.addImage(grafica, 'PNG', 112, 57, 84, 84);

  autoTable(documento, {
    startY: 147,
    head: [['Decoder', 'Eventos', '% del total']],
    body: labels.map((label, indice) => [label, String(values[indice] ?? 0), `${(totalDistribucion ? (Number(values[indice] || 0) / totalDistribucion) * 100 : 0).toFixed(1)}%`]),
    theme: 'striped',
    headStyles: { fillColor: [25, 31, 39], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [244, 245, 246] },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 },
  });

  documento.addPage();
  documento.setFillColor(205, 165, 68);
  documento.rect(0, 0, 210, 8, 'F');
  documento.setTextColor(32, 36, 42);
  documento.setFont('helvetica', 'bold');
  documento.setFontSize(18);
  documento.text('Diccionario de datos estructurado', 14, 23);
  documento.setFont('helvetica', 'normal');
  documento.setFontSize(10);
  documento.setTextColor(95, 95, 95);
  documento.text('Campos principales del JSONL y recomendaciones de uso analítico.', 14, 30);

  autoTable(documento, {
    startY: 38,
    head: [['Atributo JSON', 'Tipo de dato', 'Uso analítico']],
    body: CAMPOS_ESQUEMA,
    theme: 'striped',
    headStyles: { fillColor: [25, 31, 39], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [244, 245, 246] },
    styles: { fontSize: 8.5, cellPadding: 3, valign: 'middle' },
    columnStyles: { 0: { cellWidth: 44 }, 1: { cellWidth: 37 }, 2: { cellWidth: 101 } },
    didParseCell: (data) => {
      if (data.section === 'body' && !data.row.raw[1]) {
        data.cell.colSpan = 3;
        data.cell.styles.fillColor = [225, 225, 225];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [25, 25, 25];
      }
    },
    margin: { left: 14, right: 14 },
  });

  agregarPieDePagina(documento);
  documento.save(`HoneyMetrics_Reporte_${exportId}.pdf`);
}
