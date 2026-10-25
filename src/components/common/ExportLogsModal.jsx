import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './exportLogsModal.module.css';
import api from "../../api/client";

export default function ExportLogsModal({ open, onClose, onSubmit, onExportSuccess }) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const handleClose = () => {
    setErrorValidacion('');
    setMensajeExito('');
    if (onClose) {
      onClose();
    }
  };

  const solicitarLogs = async () => {
    // Validación explícita (WCAG 3.3.1)
    if (!fechaInicio || !fechaFinal) {
      setErrorValidacion('Por favor completa tanto la fecha de inicio como la fecha de fin.');
      return;
    }

    if (fechaInicio > fechaFinal) {
      setErrorValidacion('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    setErrorValidacion('');
    setCargando(true);

    try {
      const datosEnvio = {
        start_date: fechaInicio,
        end_date: fechaFinal,
      };

      const respuesta = await api.post('/logs/request-export', datosEnvio);
      
      setMensajeExito('Solicitud de exportación registrada exitosamente.');
      if (onExportSuccess) {
        onExportSuccess(respuesta.data);
      }
      setFechaInicio('');
      setFechaFinal('');

      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (error) {
      console.error('Error al enviar el log:', error);
      setErrorValidacion('Hubo un error al procesar la exportación. Inténtalo de nuevo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    solicitarLogs();
    if (onSubmit) {
      onSubmit({ fechaInicio, fechaFinal });
    }
  };

  const handleInputClick = (e) => {
    if (e.target.showPicker) {
      try {
        e.target.showPicker();
      } catch (err) {
      }
    }
  };

  return (
    <Modal
      open={Boolean(open)}
      onClose={handleClose}
      aria-labelledby="modal-export-logs-title"
      aria-describedby="modal-security-text"
    >
      <div
        className={styles.modalOverlay}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-export-logs-title"
      >
        <div className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <CalendarTodayOutlinedIcon className={styles.calendarHeaderIcon} aria-hidden="true" />
            <h2 id="modal-export-logs-title" className={styles.modalTitle}>
              Nuevo Export de Logs
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar modal de exportación"
          >
            <CloseIcon fontSize="small" aria-hidden="true" />
          </button>
        </div>

        <div className={styles.securityNotice}>
          <WarningAmberOutlinedIcon className={styles.warningIcon} aria-hidden="true" />
          <p id="modal-security-text" className={styles.securityText}>
            <strong>Nota de Seguridad:</strong> Las solicitudes que superen los{' '}
            <strong>50,000 registros</strong> (o más de 7 días) requerirán
            aprobación manual del Administrador vía <strong>Telegram</strong>.
          </p>
        </div>

        {errorValidacion && (
          <div
            id="error-validacion-fechas"
            className={styles.errorMessage}
            role="alert"
            aria-live="assertive"
          >
            {errorValidacion}
          </div>
        )}

        {mensajeExito && (
          <div
            className={styles.successMessage}
            role="status"
            aria-live="polite"
          >
            {mensajeExito}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="fecha-inicio" className={styles.label}>
              FECHA INICIO <span className={styles.requiredMark} aria-hidden="true">*</span>
              <span className={styles.srOnly}>(campo requerido)</span>
            </label>
            <input
              id="fecha-inicio"
              name="fechaInicio"
              type="date"
              required
              aria-required="true"
              aria-invalid={Boolean(errorValidacion)}
              aria-describedby={errorValidacion ? "error-validacion-fechas" : undefined}
              className={`${styles.dateInput} ${errorValidacion ? styles.inputError : ''}`}
              value={fechaInicio}
              onChange={(e) => {
                setFechaInicio(e.target.value);
                if (errorValidacion) setErrorValidacion('');
              }}
              onClick={handleInputClick}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fecha-fin" className={styles.label}>
              FECHA FIN <span className={styles.requiredMark} aria-hidden="true">*</span>
              <span className={styles.srOnly}>(campo requerido)</span>
            </label>
            <input
              id="fecha-fin"
              name="fechaFinal"
              type="date"
              required
              aria-required="true"
              aria-invalid={Boolean(errorValidacion)}
              aria-describedby={errorValidacion ? "error-validacion-fechas" : undefined}
              className={`${styles.dateInput} ${errorValidacion ? styles.inputError : ''}`}
              value={fechaFinal}
              onChange={(e) => {
                setFechaFinal(e.target.value);
                if (errorValidacion) setErrorValidacion('');
              }}
              onClick={handleInputClick}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={handleClose}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={cargando}
              aria-busy={cargando}
            >
              {cargando ? (
                <>
                  <CircularProgress size={18} color="inherit" aria-hidden="true" />
                  <span>Solicitando...</span>
                </>
              ) : (
                <>
                  <SendOutlinedIcon className={styles.submitIcon} aria-hidden="true" />
                  <span>Solicitar Export</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
