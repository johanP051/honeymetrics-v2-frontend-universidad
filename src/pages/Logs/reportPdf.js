/**
 * Re-export limpio desde src/utils/pdf/PdfGenerator
 * Garantiza retrocompatibilidad total sin romper imports existentes.
 */
export {
  generarReportePdf,
  generateDictionaryPDF,
  default,
} from '../../utils/pdf/PdfGenerator';
