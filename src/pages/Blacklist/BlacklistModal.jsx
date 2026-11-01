import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useModalA11y from '../../hooks/useModalA11y';
import styles from './blacklist.module.css';

const CATEGORY_OPTIONS = ['Botnet', 'APT', 'Scanner', 'Recon', 'BruteForce', 'DDoS'];

function getIpType(ip) {
  if (typeof ip !== 'string') return null;
  const ipv4Parts = ip.split('.');
  if (ipv4Parts.length === 4 && ipv4Parts.every((p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255)) {
    return 'IPv4';
  }
  if (ip.includes(':')) return 'IPv6';
  return null;
}

export default function BlacklistModal({
  open,
  onClose,
  onSubmit,
  threatToEdit = null,
}) {
  const [ip, setIp] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [threatScore, setThreatScore] = useState(50);
  const [notes, setNotes] = useState('');

  const modalRef = useModalA11y({
    isOpen: Boolean(open),
    onClose,
  });

  useEffect(() => {
    if (threatToEdit) {
      setIp(threatToEdit.ip || '');
      setCountry(threatToEdit.country || '');
      setCategory(threatToEdit.category || '');
      setThreatScore(Number(threatToEdit.threat_score ?? 50));
      setNotes(threatToEdit.notes || '');
    } else {
      setIp('');
      setCountry('');
      setCategory('');
      setThreatScore(50);
      setNotes('');
    }
  }, [threatToEdit, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanIp = ip.trim();
    const ipType = getIpType(cleanIp);
    if (!ipType) {
      alert('Introduce una dirección IPv4 o IPv6 válida.');
      return;
    }

    onSubmit({
      id: threatToEdit?.id,
      ip: cleanIp,
      ip_type: ipType,
      country: country.trim(),
      category: category || 'Scanner',
      threat_score: Number(threatScore),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <Modal open={Boolean(open)} onClose={onClose} aria-labelledby="modal-threat-title">
      <div ref={modalRef} tabIndex="-1" className={`${styles.modalAmenaza} ${styles.modalAmenazaEntrada}`} role="dialog" aria-modal="true">
        <h2 id="modal-threat-title" className={styles.tituloModal}>
          {threatToEdit ? 'Editar Amenaza' : 'Nueva Amenaza'}
        </h2>
        <IconButton className={styles.cerrarModal} aria-label="cerrar modal" onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <form id="amenaza-form" onSubmit={handleSubmit}>
          <label className={styles.ipLabel} htmlFor="ip-input">Dirección IP:</label>
          <input
            id="ip-input"
            name="ip"
            type="text"
            required
            autoComplete="off"
            placeholder="Ej. 45.148.10.151"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />

          <label className={styles.paisLabel} htmlFor="country-input">País:</label>
          <input
            id="country-input"
            name="country"
            required
            type="text"
            placeholder="Ej. Rusia"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <div className={styles.threatScoreForm}>
            <div className={styles.threatScoreFormLabel}>
              <p>Threat score:</p>
              <input
                type="number"
                min="0"
                max="100"
                value={threatScore}
                onChange={(e) => setThreatScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                aria-label="valor del threat score"
              />
            </div>
            <Slider
              value={threatScore}
              min={0}
              max={100}
              onChange={(_, val) => setThreatScore(val)}
              aria-label="threat score"
              className={styles.threatScoreSlider}
            />
          </div>

          <label className={styles.categoriaLabel} htmlFor="category-select">Categoría:</label>
          <Select
            id="category-select"
            value={category}
            required
            displayEmpty
            onChange={(e) => setCategory(e.target.value)}
            className={styles.categorySelect}
            inputProps={{ 'aria-label': 'categoría' }}
          >
            <MenuItem value="" disabled className={styles.categoryPlaceholder}>
              Selecciona una categoría
            </MenuItem>
            {CATEGORY_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>

          <label className={styles.paisLabel} htmlFor="notes-input" style={{ marginTop: '12px' }}>Notas SOC:</label>
          <input
            id="notes-input"
            name="notes"
            type="text"
            placeholder="Observaciones de telemetría"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelarModal} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={`${styles.anadirAmenazaTexto} ${styles.guardarModal}`}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
