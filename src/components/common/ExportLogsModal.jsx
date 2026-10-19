import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import styles from './exportLogsModal.module.css';
import api from "../../api/client";


export default function ExportLogsModal({ open, onClose, onSubmit, onExportSuccess }) {
  const [fechaInicio, setFechaInicio] = React.useState('');
  const [fechaFinal, setFechaFinal] = React.useState('');
  const [cargando, setCargando] = React.useState(false);
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };


  const solicitarLogs = async () => {
    setCargando(true);
    try {
      const datosEnvio = {
        start_date: fechaInicio,
        end_date: fechaFinal,
      };

      const respuesta = await api.post('/logs/request-export', datosEnvio);
      
      console.log('Log registrado con éxito:', respuesta.data);
      alert('¡Acción registrada en la API!');
      setFechaInicio('');
      setFechaFinal('');
      handleClose();
      if (onExportSuccess) {
        onExportSuccess(respuesta.data);
      }
    } catch (error) {
      console.error('Error al enviar el log:', error);
      alert('Hubo un error al conectar con la API.');
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
    >
      <div className={styles.modalOverlay}>
        <div className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <CalendarTodayOutlinedIcon className={styles.calendarHeaderIcon} />
            <h2 id="modal-export-logs-title" className={styles.modalTitle}>
              Nuevo Export de Logs
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        
        <div className={styles.securityNotice}>
          <WarningAmberOutlinedIcon className={styles.warningIcon} />
          <p className={styles.securityText}>
            <strong>Nota de Seguridad:</strong> Las solicitudes que superen los{' '}
            <strong>50,000 registros</strong> (o más de 7 días) requerirán
            aprobación manual del Administrador vía <strong>Telegram</strong>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="fecha-inicio" className={styles.label}>
              FECHA INICIO
            </label>
            <input
              id="fecha-inicio"
              name="fechaInicio"
              type="date" required
              className={styles.dateInput}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              onClick={handleInputClick}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fecha-fin" className={styles.label}>
              FECHA FIN
            </label>
            <input
              id="fecha-fin"
              name="fechaFinal"
              type="date" required
              className={styles.dateInput}
              value={fechaFinal}
              onChange={(e) => setFechaFinal(e.target.value)}
              onClick={handleInputClick}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnSubmit}>
              <SendOutlinedIcon className={styles.submitIcon} />
              Solicitar Export
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
