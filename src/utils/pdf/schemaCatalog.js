/**
 * Diccionario de Datos Canónico de 7 Secciones y 44 Atributos Técnicos
 * Para Feature Engineering y Modelos de Detección de Amenazas (ML / NLP / Clustering)
 */
export const CAMPOS_ESQUEMA = [
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

export function pickMlTip(labels) {
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
