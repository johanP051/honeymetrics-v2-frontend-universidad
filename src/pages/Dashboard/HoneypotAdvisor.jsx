import React from 'react';
import { Container } from '@mui/material';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';

const advisorTemplates = [
  { name: 'root', type: 'System', percentage: 59.6, icon: TerminalOutlinedIcon, color: 'yellow' },
  { name: 'admin', type: 'System', percentage: 17.2, icon: TerminalOutlinedIcon, color: 'yellow' },
  { name: 'postgres', type: 'Database', percentage: 8.6, icon: StorageOutlinedIcon, color: 'teal' },
  { name: 'odoo', type: 'ERP', percentage: 6.0, icon: GppMaybeOutlinedIcon, color: 'red' },
  { name: 'jenkins', type: 'DevOps', percentage: 3.2, icon: StorageOutlinedIcon, color: 'yellow' },
  { name: 'Ubuntu', type: 'System', percentage: 2.3, icon: TerminalOutlinedIcon, color: 'yellow' },
];

export default function HoneypotAdvisor({ totalEvents = 0, styles }) {
  return (
    <Container maxWidth={false} sx={{ maxWidth: '25vw' }} className={`${styles.contenedor} ${styles.advisorContainer}`}>
      <div className={styles.advisorHeader}>
        <div>
          <h6>Honeypot Advisor</h6>
          <p>Top diccionarios SSH probados</p>
        </div>
        <span className={styles.advisorBadge}>CTI RECON</span>
      </div>
      <div className={styles.advisorList}>
        {advisorTemplates.map(({ name, type, percentage, icon: Icon, color }) => {
          const calculatedAttempts = Math.max(1, Math.round((totalEvents || 0) * (percentage / 100)));
          return (
            <div className={styles.advisorItem} key={name}>
              <div className={styles.advisorItemHeader}>
                <div className={styles.advisorName}>
                  <span className={`${styles.advisorIcon} ${styles[`advisorIcon${color}`]}`}>
                    <Icon />
                  </span>
                  <strong>{name}</strong>
                  <small>({type})</small>
                </div>
                <span className={styles.advisorAttempts}>
                  {calculatedAttempts.toLocaleString('es-CO')} <small>intentos</small>
                </span>
              </div>
              <div className={styles.advisorProgressRow}>
                <div className={styles.advisorProgressTrack}>
                  <div
                    className={`${styles.advisorProgressBar} ${styles[`advisorBar${color}`]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <small>{percentage}%</small>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
