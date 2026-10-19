import jsPDF from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import logoHoneyMetrics from '../../assets/HoneyMetrics_logo_circled.png';

// Asegurar enlace de plugin en entornos ESM (Vite / Rollup)
try {
  if (typeof applyPlugin === 'function') {
    applyPlugin(jsPDF);
  }
} catch (e) {
  // AutoTable plugin ya inicializado
}

/**
 * Diccionario de Datos Canónico de 7 Secciones y 44 Atributos Técnicos
 * Para Feature Engineering y Modelos de Detección de Amenazas (ML / NLP / Clustering)
 */
const CAMPOS_ESQUEMA = [
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
    }))
    .catch((err) => {
      console.warn('No se pudo cargar la imagen para el PDF:', err);
      return null;
    });
}

function pickMlTip(labels) {
  const topDecoder = String((labels && labels[0]) || '').toLowerCase();

  if (topDecoder.includes('syscheck') || topDecoder.includes('fim')) {
    return 'Alta presencia de FIM. Usa hashes (MD5/SHA256) y tamaños para entrenar modelos de detección de anomalías por integridad.';
  }
  if (topDecoder.includes('rootcheck')) {
    return "Alta presencia de Rootcheck. Aplica NLP a campos textuales (p.ej. 'full_log') y extrae rutas de 'data.file' para clustering.";
  }
  if (topDecoder.includes('apparmor')) {
    return "Eventos de AppArmor. Modela acciones DENIED/ALLOWED y extrae features de comandos/rutas en 'data.extra_data'.";
  }
  if (topDecoder.includes('kernel')) {
    return "Eventos de Kernel. Clusteriza por 'rule.mitre.id' y correlaciona con 'data.extra_data' para identificar TTPs recurrentes.";
  }
  if (topDecoder.includes('sshd') || topDecoder.includes('pam')) {
    return "Predominio de eventos SSH / PAM. Extrae frecuencias por IP, usuarios objetivo y correlaciona con listas de contraseñas débiles para perfilar fuerza bruta.";
  }

  return 'Analiza la distribución del dataset para balancear clases y crea variables categóricas (decoder, rule.level, rule.groups) y temporales (@timestamp).';
}

function crearGraficaDonut(values) {
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

/**
 * Generador Universal Unificado de Reporte PDF
 * Combina la tabla ejecutiva de decoders de Juan con el esquema completo de 7 secciones ML
 */
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
    Promise.resolve(crearGraficaDonut(values)),
  ]);

  const indicePrincipal = values.reduce((indiceMayor, valor, indice, arreglo) => (
    Number(valor) > Number(arreglo[indiceMayor]) ? indice : indiceMayor
  ), 0);
  const decoderPrincipal = labels[indicePrincipal] || 'sin clasificación';
  const mlTip = pickMlTip(labels);

  // ==========================================
  // PÁGINA 1: RESUMEN EJECUTIVO & DECODERS
  // ==========================================
  // Barra superior dorada (8mm)
  documento.setFillColor(205, 165, 68); // #CDA544
  documento.rect(0, 0, 210, 8, 'F');

  if (logo) {
    documento.addImage(logo, 'PNG', 14, 13, 16, 16);
  }

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

  // Línea separadora
  documento.setDrawColor(215, 215, 215);
  documento.line(14, 34, 196, 34);

  // Columna Izquierda: Métricas
  documento.setFont('helvetica', 'bold');
  documento.setFontSize(13);
  documento.setTextColor(20, 20, 20);
  documento.text('Resumen Ejecutivo', 14, 44);

  documento.setFont('helvetica', 'normal');
  documento.setFontSize(9.5);
  documento.setTextColor(60, 60, 60);
  documento.text(
    documento.splitTextToSize(
      'Este reporte consolida la telemetría extraída de los Honeypots y especifica el diccionario estructurado de variables para entrenamiento de modelos de Machine Learning y detección de anomalías CTI.',
      92
    ),
    14,
    51
  );

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

  // Columna Derecha: Gráfica Donut
  documento.setTextColor(20, 20, 20);
  documento.setFont('helvetica', 'bold');
  documento.setFontSize(13);
  documento.text('Eventos por Decoder', 130, 44);

  if (grafica) {
    documento.addImage(grafica, 'PNG', 120, 48, 76, 76);
  }

  // Tabla inferior en Página 1: Desglose de Decoders (Aporte Juan)
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

  // ==========================================
  // PÁGINA 2 Y 3: DICCIONARIO CANÓNICO COMPLETO (7 SECCIONES)
  // ==========================================
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
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 34 },
      2: { cellWidth: 106 },
    },
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
