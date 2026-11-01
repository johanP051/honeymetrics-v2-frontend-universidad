import React from 'react';
import { Container } from '@mui/material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

export default function DashboardMetricsGrid({ metrics, styles }) {
  return (
    <div className={styles.datos}>
      <Container maxWidth={false} className={styles.contenedor} id={styles.dat}>
        <div className={styles.metricHeader}>
          <h3 className={styles.metricTitle}>Eventos analizados</h3>
          <AssessmentOutlinedIcon className={`${styles.metricIcon} ${styles.metricBlue}`} />
        </div>
        <h2 className={styles.metricBlue}>
          {Number(metrics?.total_analyzed_events || 0).toLocaleString('es-CO')}
        </h2>
      </Container>

      <Container maxWidth={false} className={styles.contenedor} id={styles.dat}>
        <div className={styles.metricHeader}>
          <h3 className={styles.metricTitle}>IPs Atacantes</h3>
          <ReportGmailerrorredIcon className={`${styles.metricIcon} ${styles.metricRed}`} />
        </div>
        <h2 className={styles.metricRed}>
          {Number(metrics?.unique_attacker_ips || 0).toLocaleString('es-CO')}
        </h2>
      </Container>

      <Container maxWidth={false} className={styles.contenedor} id={styles.dat}>
        <div className={styles.metricHeader}>
          <h3 className={styles.metricTitle}>Amenazas Persistentes</h3>
          <TrendingUpIcon className={`${styles.metricIcon} ${styles.metricYellow}`} />
        </div>
        <h2 className={styles.metricYellow}>
          {Number(metrics?.persistent_threats_count || 0).toLocaleString('es-CO')}
        </h2>
      </Container>

      <Container maxWidth={false} className={styles.contenedor} id={styles.dat}>
        <div className={styles.metricHeader}>
          <h3 className={styles.metricTitle}>CVEs Activos</h3>
          <VerifiedUserOutlinedIcon className={`${styles.metricIcon} ${styles.metricGreen}`} />
        </div>
        <h2 className={styles.metricGreen}>
          {Number(metrics?.active_critical_cves_count || 0).toLocaleString('es-CO')}
        </h2>
      </Container>
    </div>
  );
}
