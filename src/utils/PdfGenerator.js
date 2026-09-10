import jsPDF from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import logoCircledPath from '../assets/HoneyMetrics_logo_circled.png';
import { getReportStatsApi } from '../api/logsApi';

// Asegurar enlace de plugin en entornos ESM (Vite / Rollup)
try {
  if (typeof applyPlugin === 'function') {
    applyPlugin(jsPDF);
  }
} catch (e) {
  console.warn('AutoTable plugin already initialized or not needed', e);
}

function formatDateTimeEs(date) {
  try {
    return date.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
  } catch (e) {
    try {
      return date.toLocaleString('es-ES');
    } catch (e2) {
      return date.toISOString();
    }
  }
}

function pickMlTip(labels) {
  const topDecoder = String((labels && labels[0]) || '').toLowerCase();

  if (topDecoder.includes('syscheck') || topDecoder.includes('fim')) {
    return 'Alta presencia de FIM. Usa hashes (MD5/SHA256) y tamaños para entrenar modelos de detección de anomalías por integridad.';
  }

  if (topDecoder.includes('rootcheck')) {
    return 'Alta presencia de Rootcheck. Aplica NLP a campos textuales (p.ej. \'full_log\') y extrae rutas de \'data.file\' para clustering.';
  }

  if (topDecoder.includes('apparmor')) {
    return 'Eventos de AppArmor. Modela acciones DENIED/ALLOWED y extrae features de comandos/rutas en \'data.extra_data\'.';
  }

  if (topDecoder.includes('kernel')) {
    return 'Eventos de Kernel. Clusteriza por \'rule.mitre.id\' y correlaciona con \'data.extra_data\' para identificar TTPs recurrentes.';
  }

  return 'Analiza la distribución del dataset para balancear clases y crea variables categóricas (decoder, rule.level, rule.groups) y temporales (@timestamp).';
}

function loadImageBase64(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Error al convertir logo a base64:', err);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function buildGraphBase64(stats) {
  try {
    const labels = Array.isArray(stats?.labels) && stats.labels.length ? stats.labels : ['rootcheck', 'syscheck', 'kernel', 'ossec'];
    const values = Array.isArray(stats?.values) && stats.values.length ? stats.values.map((v) => Number(v) || 0) : [45, 30, 20, 5];
    const colors = ['#c9a24a', '#333333', '#8b949e', '#4b8bbf', '#d06b62'];

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 600);

    const total = values.reduce((acc, v) => acc + v, 0) || 1;
    const centerX = 300;
    const centerY = 240;
    const outerRadius = 180;
    const innerRadius = 95;

    let currentAngle = -0.5 * Math.PI;

    for (let i = 0; i < values.length; i++) {
      const sliceAngle = (values[i] / total) * (2 * Math.PI);
      const endAngle = currentAngle + sliceAngle;
      const color = colors[i % colors.length];

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, currentAngle, true);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      currentAngle = endAngle;
    }

    // Leyendas en la parte inferior
    ctx.textBaseline = 'middle';
    let currX = 30;
    let currY = 485;

    for (let i = 0; i < labels.length; i++) {
      const color = colors[i % colors.length];
      const text = labels[i];

      // Cuadro indicador de color
      ctx.fillStyle = color;
      ctx.fillRect(currX, currY - 6, 16, 12);

      // Etiqueta
      ctx.fillStyle = '#666666';
      ctx.font = '13px Helvetica, Arial, sans-serif';
      ctx.fillText(text, currX + 22, currY);

      currX += ctx.measureText(text).width + 38;
      if (currX > 480 && i < labels.length - 1) {
        currX = 30;
        currY += 26;
      }
    }

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Error generando gráfica doughnut:', err);
    return null;
  }
}

export const generateDictionaryPDF = async (exportItem = null) => {
  try {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const generatedAt = new Date();

    const exportId = exportItem?.id || '0002';
    const paddedId = String(exportId).replace(/^EXP-/, '').padStart(4, '0');

    // Obtener estadísticas de decoders reales desde backend o fallback
    let stats = null;
    if (exportItem?.id) {
      stats = await getReportStatsApi(exportItem.id);
    }
    if (!stats) {
      stats = {
        labels: ['rootcheck', 'syscheck_integrity_changed', 'kernel', 'ossec'],
        values: [45, 30, 20, 5],
        total_logs: exportItem?.count || 46,
        start_date: exportItem?.date_range?.split(' / ')[0] || '2026-04-01',
        end_date: exportItem?.date_range?.split(' / ')[1] || '2026-04-01',
      };
    }

    // 1. ENCABEZADO (Barra dorada de 8mm estilo original)
    doc.setFillColor(201, 162, 74); // #c9a24a
    doc.rect(0, 0, 210, 8, 'F');

    // Logo circular original
    try {
      const logoBase64 = await loadImageBase64(logoCircledPath);
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 14, 12, 12, 12);
      }
    } catch (e) {
      console.warn('No se pudo incrustar el logo en el PDF', e);
    }

    // Título y subtítulo
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Esquema de Datos para ML', 28, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Documentación Técnica del Dataset', 28, 26);

    // Metadatos a la derecha
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const fechaHora = formatDateTimeEs(generatedAt);
    doc.text(`ID Solicitud: #${paddedId}`, 196, 20, { align: 'right' });
    doc.text(`Fecha y hora: ${fechaHora}`, 196, 26, { align: 'right' });

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 38, 196, 38);

    // 2. RESUMEN EJECUTIVO (Columna Izquierda)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, 50);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const textOverview = doc.splitTextToSize(
      'Esta guía proporciona el esquema canónico y la referencia de todos los campos extraídos en el archivo JSONL. Utilízala para realizar limpieza de datos, extracción de características (Feature Engineering) y entrenamiento de modelos de IA.',
      90
    );
    doc.text(textOverview, 14, 58);

    doc.setFont('helvetica', 'bold');
    doc.text('Total Logs Extraídos:', 14, 78);
    doc.setFont('helvetica', 'normal');
    doc.text(Number(stats.total_logs || 0).toLocaleString('es-ES'), 55, 78);

    doc.setFont('helvetica', 'bold');
    doc.text('Rango de Fechas:', 14, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(`${stats.start_date || ''} a ${stats.end_date || ''}`, 48, 85);

    // Consejo de Ingeniería (ML Tip) en color dorado
    const tip = pickMlTip(stats.labels);
    doc.setTextColor(201, 162, 74);
    doc.setFont('helvetica', 'bold');
    doc.text('Consejo de Ingeniería (ML Tip):', 14, 98);
    doc.setFont('helvetica', 'normal');
    const textTip = doc.splitTextToSize(tip, 90);
    doc.text(textTip, 14, 104);

    // 3. GRÁFICA EVENTOS POR DECODER (Columna Derecha)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Eventos por Decoder', 130, 50);

    const base64Graph = buildGraphBase64(stats);
    if (base64Graph) {
      doc.addImage(base64Graph, 'PNG', 120, 55, 60, 60);
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Gráfica no disponible', 120, 80);
    }

    // 4. TABLA CANÓNICA COMPLETA (Full Schema - 7 Secciones del Monolito)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Diccionario de Datos Estructurado (Full Schema)', 14, 125);

    const tableConfig = {
      startY: 130,
      margin: { left: 14, right: 14, bottom: 18 },
      headStyles: { fillColor: [20, 25, 30], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      bodyStyles: { textColor: 40, fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 30 },
        2: { cellWidth: 'auto' },
      },
      head: [['Atributo JSON', 'Tipo de Dato', 'Instrucciones de Uso (Feature Engineering)']],
      body: [
        [{ content: '1. METADATOS Y CORE', colSpan: 3, styles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' } }],
        ['@timestamp', 'String (ISO 8601)', 'Tiempo exacto de ocurrencia. Parsear a datetime para extraer features temporales (hora, día de la semana, mes).'],
        ['id', 'String', 'Identificador único del evento. Usar para limpieza de datos (deduplicación).'],
        ['decoder.name', 'String', 'Motor que procesó el evento (syscheck, rootcheck, kernel). Usar como variable categórica principal.'],
        ['location', 'String', 'Origen del log (ej. journald, logcollector). Indica la fuente de extracción.'],
        ['full_log', 'String (Text)', 'Log crudo original. Ideal para entrenar modelos de NLP (Procesamiento de Lenguaje Natural) con TF-IDF.'],

        [{ content: '2. IDENTIFICACIÓN DE ACTIVOS (AGENTES)', colSpan: 3, styles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' } }],
        ['agent.id', 'String', 'ID numérico del agente. Usar en cruces de bases de datos relacionales.'],
        ['agent.name', 'String', 'Nombre del Honeypot (ej. sprox1). Aplicar One-Hot Encoding para perfilar la superficie de ataque por servidor.'],
        ['agent.ip', 'String (IPv4/IPv6)', 'Dirección IP del agente comprometido. Útil para análisis de topología y correlación de red.'],
        ['manager.name', 'String', 'Nombre del nodo administrador central (wazuh.manager).'],

        [{ content: '3. REGLAS E INTELIGENCIA DE AMENAZAS', colSpan: 3, styles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' } }],
        ['rule.id', 'String / Int', 'Firma única de la alerta detonada. Feature clave para modelos de Clasificación.'],
        ['rule.level', 'Entero (1-16)', 'Nivel de severidad de la alerta. Usar directamente como variable ordinal predictiva.'],
        ['rule.description', 'String', 'Descripción humana de la alerta. Agrupar mediante técnicas de Topic Modeling.'],
        ['rule.groups', 'Array[String]', 'Categorías generales del ataque (ej. ossec, syslog). Convertir a Multi-Label Binarizer.'],
        ['rule.firedtimes', 'Entero', 'Frecuencia con la que la regla se ha disparado. Útil para detectar ataques de fuerza bruta.'],

        [{ content: '4. FRAMEWORK MITRE ATT&CK', colSpan: 3, styles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' } }],
        ['rule.mitre.id', 'Array[String]', 'ID de técnica MITRE (ej. T1565.001). Excelente para clustering y clasificación estandarizada de atacantes.'],
        ['rule.mitre.tactic', 'Array[String]', 'Fase del ataque (ej. Impact, Initial Access). Usar para predecir la intención del intruso.'],
        ['rule.mitre.technique', 'Array[String]', 'Nombre de la técnica específica (ej. Stored Data Manipulation).'],

        [{ content: '5. COMPLIANCE (CUMPLIMIENTO NORMATIVAS)', colSpan: 3, styles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' } }],
        ['rule.pci_dss', 'Array[String]', 'Requisitos PCI-DSS vulnerados (Estándar de tarjetas de pago). Convertir a variables booleanas.'],
        ['rule.gdpr', 'Array[String]', 'Artículos del Reglamento Europeo de Protección de Datos (GDPR) afectados.'],
        ['rule.hipaa', 'Array[String]', 'Controles de salud (HIPAA) vulnerados.'],
        ['rule.nist_800_53', 'Array[String]', 'Controles de seguridad NIST afectados.'],

        [{ content: '6. FIM - FILE INTEGRITY MONITORING (SYSCHECK)', colSpan: 3, styles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' } }],
        ['syscheck.path', 'String', 'Ruta absoluta del archivo modificado (ej. /etc/pve/.rrd).'],
        ['syscheck.event', 'String', 'Tipo de cambio (modified, added, deleted). Variable categórica de alto valor predictivo.'],
        ['syscheck.changed_attributes', 'Array[String]', 'Lista de atributos alterados (size, md5, mtime). Usar para ponderar la severidad del cambio.'],
        ['syscheck.md5_before', 'String (Hash)', 'Hash MD5 previo a la modificación.'],
        ['syscheck.sha256_after', 'String (Hash)', 'Nuevo hash criptográfico. Cruzar con APIs de Threat Intel (VirusTotal) para enriquecimiento de datos.'],
        ['syscheck.uname_after', 'String', 'Usuario propietario del archivo resultante (ej. root). Monitorear escalada de privilegios.'],
        ['syscheck.size_after', 'Entero', 'Nuevo tamaño del archivo en bytes. Detectar inyecciones masivas de código.'],

        [{ content: '7. ANOMALÍAS Y ROOTKITS (DATA)', colSpan: 3, styles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' } }],
        ['data.file', 'String', 'Archivo troyanizado o puerto oculto (ej. /bin/chsh). Extraer extensión o ruta padre como nueva Feature.'],
        ['data.title', 'String', 'Clasificación de la anomalía detectada (ej. "Trojaned version of file detected").'],
        ['data.extra_data', 'String', 'Comandos o funciones interceptadas por el Kernel (ej. mknod).'],
        ['data.status', 'String', 'Estado de la acción del Kernel (ej. DENIED). Variable binaria/categórica.'],
      ],
    };

    if (typeof doc.autoTable === 'function') {
      doc.autoTable(tableConfig);
    } else {
      autoTable(doc, tableConfig);
    }

    // 5. PIE DE PÁGINA (Paginación dinámica y sello de confidencialidad)
    const totalPages = doc.internal.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(136, 136, 136);

      doc.text('Confidencial - Reporte autogenerado | Cumplimiento ISO/IEC 27001', 14, pageHeight - 10);
      doc.text(`Página ${page} de ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    }

    doc.save(`HoneyMetrics_Schema_Download_${exportId}.pdf`);
  } catch (error) {
    console.error('Error generando el PDF del esquema ML:', error);
    alert('No se pudo generar el reporte en PDF: ' + error.message);
  }
};
