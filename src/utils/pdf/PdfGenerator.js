import jsPDF from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import logoHoneyMetrics from '../../assets/HoneyMetrics_logo_circled.png';
import { CAMPOS_ESQUEMA, pickMlTip } from './schemaCatalog';
import { cargarImagenComoDataUrl, crearGraficaDonut } from './pdfCanvasCharts';

try {
  if (typeof applyPlugin === 'function') {
    applyPlugin(jsPDF);
  }
} catch (_) {}

function agregarPieDePagina(documento) {
  const totalPaginas = documento.getNumberOfPages();
  const pageHeight = documento.internal.pageSize.getHeight();
  const pageWidth = documento.internal.pageSize.getWidth();

  for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
    documento.setPage(pagina);
    documento.setDrawColor(210, 210, 210);
    documento.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);
    documento.setFontSize(8);
    documento.setTextColor(135, 135, 135);
    documento.setFont('helvetica', 'normal');
    documento.text('Confidencial - Reporte autogenerado | Cumplimiento ISO/IEC 27001', 14, pageHeight - 6);
    documento.text(`Página ${pagina} de ${totalPaginas}`, pageWidth - 14, pageHeight - 6, { align: 'right' });
  }
}

export async function generarReportePdf(exportId = 'EXP-0001', estadisticas = {}) {
  const labels = Array.isArray(estadisticas?.labels) && estadisticas.labels.length
    ? estadisticas.labels
    : ['json', 'pam', 'dpkg-decoder', 'syscheck_integrity_changed', 'sshd', 'rootcheck'];
  const values = Array.isArray(estadisticas?.values) && estadisticas.values.length
    ? estadisticas.values.map((v) => Number(v) || 0)
    : [4243, 226, 111, 95, 86, 60];
  const totalLogs = estadisticas?.total_logs || values.reduce((acc, v) => acc + v, 0);
  const fechaInicio = estadisticas?.start_date || '2026-04-01';
  const fechaFin = estadisticas?.end_date || '2026-08-31';

  const totalDistribucion = values.reduce((acumulado, valor) => acumulado + Number(valor || 0), 0) || 1;
  const documento = new jsPDF({ format: 'a4', unit: 'mm' });
  const fechaGeneracion = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());

  const [logo, grafica] = await Promise.all([
    cargarImagenComoDataUrl(logoHoneyMetrics),
    Promise.resolve(crearGraficaDonut(values, labels)),
  ]);

  const indicePrincipal = values.reduce((mayor, v, i, arr) => (Number(v) > Number(arr[mayor]) ? i : mayor), 0);
  const decoderPrincipal = labels[indicePrincipal] || 'sin clasificación';
  const mlTip = pickMlTip(labels);

  // PÁGINA 1: RESUMEN EJECUTIVO & DECODERS
  documento.setFillColor(205, 165, 68);
  documento.rect(0, 0, 210, 8, 'F');
  if (logo) documento.addImage(logo, 'PNG', 14, 13, 16, 16);

  documento.setTextColor(32, 36, 42);
  documento.setFont('helvetica', 'bold');
  documento.setFontSize(16);
  documento.text('Reporte Técnico y Esquema de Datos ML', 34, 20);

  documento.setFont('helvetica', 'normal');
  documento.setTextColor(95, 95, 95);
  documento.setFontSize(9.5);
  documento.text('Telemetría de Honeypots y Diccionario para Feature Engineering', 34, 26);

  documento.setTextColor(32, 36, 42);
  documento.setFontSize(9.5);
  documento.text(`ID Solicitud: #${exportId}`, 196, 20, { align: 'right' });
  documento.text(`Generado: ${fechaGeneracion}`, 196, 26, { align: 'right' });

  documento.setDrawColor(215, 215, 215);
  documento.line(14, 34, 196, 34);

  documento.setFont('helvetica', 'bold');
  documento.setFontSize(13);
  documento.setTextColor(20, 20, 20);
  documento.text('Resumen Ejecutivo', 14, 44);

  documento.setFont('helvetica', 'normal');
  documento.setFontSize(9.5);
  documento.setTextColor(60, 60, 60);
  documento.text(documento.splitTextToSize('Este reporte consolida la telemetría extraída de los Honeypots y especifica el diccionario estructurado de variables para entrenamiento de modelos de Machine Learning y detección de anomalías CTI.', 92), 14, 51);

  documento.setFont('helvetica', 'bold');
  documento.setTextColor(20, 20, 20);
  documento.text('Total logs extraídos:', 14, 71);
  documento.setFont('helvetica', 'normal');
  documento.text(Number(totalLogs).toLocaleString('es-CO'), 56, 71);

  documento.setFont('helvetica', 'bold');
  documento.text('Rango de fechas:', 14, 78);
  documento.setFont('helvetica', 'normal');
  documento.text(`${fechaInicio} a ${fechaFin}`, 49, 78);

  documento.setTextColor(180, 140, 40);
  documento.setFont('helvetica', 'bold');
  documento.text('Consejo de Ingeniería (ML Tip):', 14, 88);
  documento.setFont('helvetica', 'normal');
  documento.setTextColor(50, 50, 50);
  documento.text(documento.splitTextToSize(mlTip, 92), 14, 94);

  documento.setTextColor(20, 20, 20);
  documento.setFont('helvetica', 'bold');
  documento.text('Decoder predominante:', 14, 114);
  documento.setFont('helvetica', 'normal');
  documento.text(`${decoderPrincipal} (${((Number(values[indicePrincipal] || 0) / totalDistribucion) * 100).toFixed(1)}%)`, 58, 114);

  documento.setFont('helvetica', 'bold');
  documento.setFontSize(13);
  documento.text('Distribución por Decoder', 118, 44);
  if (grafica) documento.addImage(grafica, 'PNG', 114, 48, 82, 60);

  autoTable(documento, {
    startY: 132,
    head: [['Decoder', 'Eventos', '% del total']],
    body: labels.map((label, indice) => [
      label,
      Number(values[indice] ?? 0).toLocaleString('es-CO'),
      `${((Number(values[indice] || 0) / totalDistribucion) * 100).toFixed(1)}%`,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [25, 31, 39], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [246, 247, 249] },
    styles: { fontSize: 8.5, cellPadding: 2.2 },
    columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 50 }, 2: { cellWidth: 52 } },
    margin: { left: 14, right: 14 },
  });

  // PÁGINA 2 Y 3: DICCIONARIO CANÓNICO
  documento.addPage();
  documento.setFillColor(205, 165, 68);
  documento.rect(0, 0, 210, 8, 'F');

  documento.setTextColor(32, 36, 42);
  documento.setFont('helvetica', 'bold');
  documento.setFontSize(16);
  documento.text('Diccionario de Datos Estructurado (Full Schema)', 14, 21);

  documento.setFont('helvetica', 'normal');
  documento.setFontSize(9.5);
  documento.setTextColor(95, 95, 95);
  documento.text('Campos canónicos del JSONL e instrucciones de uso para Feature Engineering y Modelos ML.', 14, 27);

  autoTable(documento, {
    startY: 33,
    head: [['Atributo JSON', 'Tipo de Dato', 'Instrucciones de Uso (Feature Engineering)']],
    body: CAMPOS_ESQUEMA,
    theme: 'striped',
    headStyles: { fillColor: [25, 31, 39], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    styles: { fontSize: 8, cellPadding: 2.5, valign: 'middle' },
    columnStyles: { 0: { cellWidth: 42, fontStyle: 'bold' }, 1: { cellWidth: 34 }, 2: { cellWidth: 106 } },
    didParseCell: (data) => {
      if (data.section === 'body' && !data.row.raw[1]) {
        data.cell.colSpan = 3;
        data.cell.styles.fillColor = [228, 230, 235];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [20, 20, 20];
        data.cell.styles.fontSize = 8.5;
      }
    },
    margin: { left: 14, right: 14, bottom: 18 },
  });

  agregarPieDePagina(documento);
  documento.save(`HoneyMetrics_Reporte_${exportId}.pdf`);
  return documento;
}

export const generateDictionaryPDF = async (exportItem = null) => {
  return generarReportePdf(exportItem?.id || 'EXP-0001', {
    total_logs: exportItem?.count,
    start_date: exportItem?.date_range?.split(' / ')[0],
    end_date: exportItem?.date_range?.split(' / ')[1],
  });
};

export default generarReportePdf;
