import React from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import { TextoAnimado } from './LogsPaginationActions';
import styles from './logs.module.css';

export default function LogsActionButtons({
  texto,
  exportId,
  descargandoId,
  generandoReporteId,
  onDownload,
  onGenerarReporte,
}) {
  if (texto === 'Listo') {
    return (
      <div className={styles.botonesAccion}>
        <button
          type="button"
          className={styles.botonDescarga}
          onClick={() => onDownload(exportId)}
          disabled={descargandoId === exportId}
          aria-label={`Descargar exportación ${exportId}`}
        >
          <FileDownloadOutlinedIcon aria-hidden="true" />
          <span className={styles.srOnly}>Descargar archivo de exportación {exportId}</span>
        </button>
        <button
          type="button"
          className={styles.botonPdf}
          onClick={() => onGenerarReporte(exportId)}
          disabled={generandoReporteId === exportId}
          aria-label={`Generar reporte PDF de exportación ${exportId}`}
        >
          <TextSnippetOutlinedIcon className={styles.iconoPdf} aria-hidden="true" />
          <span className={styles.srOnly}>Generar reporte PDF de exportación {exportId}</span>
        </button>
      </div>
    );
  }

  if (texto === 'Pendiente de Aprobación') {
    return (
      <div className={styles.botonesAccion} id={styles.telegramContainer} role="status">
        <ScheduleSendOutlinedIcon className={styles.iconoSend} aria-hidden="true" />
        <p className={styles.textoTelegram}>Esperando Telegram</p>
      </div>
    );
  }

  if (texto === 'Procesando') {
    return (
      <div role="status">
        <TextoAnimado texto="En cola Celery ..." />
      </div>
    );
  }

  if (texto === 'Rechazada') {
    return <span className={styles.sinAcciones} aria-label="Sin acciones disponibles">—</span>;
  }

  return null;
}
