import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@mui/material';
import styles from './dashboard.module.css';
import style from '../Blacklist/blacklist.module.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import TitanicPie from '../../components/common/chartPie';
import LineMarkShape from '../../components/common/chartLine';
import ColorConfig from '../../components/common/heatMap';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../api/client';
import DashboardMetricsGrid from './DashboardMetricsGrid';
import HoneypotAdvisor from './HoneypotAdvisor';

const FALLBACK_METRICS = {
  '24h': { total_analyzed_events: 1920, unique_attacker_ips: 84, persistent_threats_count: 3, active_critical_cves_count: 142 },
  '7d': { total_analyzed_events: 28400, unique_attacker_ips: 320, persistent_threats_count: 7, active_critical_cves_count: 680 },
  '30d': { total_analyzed_events: 84200, unique_attacker_ips: 680, persistent_threats_count: 9, active_critical_cves_count: 1240 },
  '90d': { total_analyzed_events: 142000, unique_attacker_ips: 990, persistent_threats_count: 9, active_critical_cves_count: 1590 },
};

export default function Dashboard() {
  const [activePreset, setActivePreset] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [, setError] = useState('');
  const [metrics, setMetrics] = useState({
    total_analyzed_events: 165247,
    unique_attacker_ips: 1107,
    persistent_threats_count: 9,
    active_critical_cves_count: 1721,
    peak_hour_utc: '11:00 - 12:00 UTC',
  });

  const fetchSummary = useCallback(async (preset) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/threats/summary', {
        params: { range_preset: preset, range: preset },
      });
      if (response.data) {
        setMetrics({
          total_analyzed_events: response.data.total_analyzed_events ?? 0,
          unique_attacker_ips: response.data.unique_attacker_ips ?? 0,
          persistent_threats_count: response.data.persistent_threats_count ?? 0,
          active_critical_cves_count: response.data.active_critical_cves_count ?? 0,
          peak_hour_utc: response.data.peak_hour_utc || '11:00 - 12:00 UTC',
        });
      }
    } catch (err) {
      console.warn('Error al consultar /threats/summary, usando datos de contingencia:', err);
      setError('No se logró cargar los datos en el dashboard');
      if (FALLBACK_METRICS[preset]) {
        setMetrics((prev) => ({ ...prev, ...FALLBACK_METRICS[preset] }));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(activePreset);
  }, [activePreset, fetchSummary]);

  return (
    <>
      {loading && (
        <div className={style.loadingOverlay} role="status" aria-live="polite" aria-label="Cargando métricas del dashboard">
          <CircularProgress aria-label="Cargando" />
        </div>
      )}

      <Navbar />

      <main id="main-content" tabIndex="-1" className="outline-none">
        <div className={styles.headerContent}>
        <div className={styles.textHeader}>
          <div className={styles.textContent}>
            <h2><DashboardIcon className={styles.icon} sx={{ fontSize: '30px' }} />Dashboard</h2>
            <p>Monitoreo de telemetría e indicadores del Honeypot (CTI).</p>
          </div>
        </div>
        <div className={styles.buttons}>
          <div className={styles.contenedorBotones}>
            {['24h', '7d', '30d', '90d'].map((preset) => (
              <button
                key={preset}
                type="button"
                className={activePreset === preset ? styles.activeButton : ''}
                onClick={() => setActivePreset(preset)}
              >
                {preset === '24h' ? 'Últimas 24h' : preset === '7d' ? 'Últimas 7 días' : preset === '30d' ? 'Últimas 30 días' : 'Últimos trimestres'}
              </button>
            ))}
            <p>|</p>
            <button type="button" className={styles.calendarButton}>
              <CalendarMonthOutlinedIcon className={styles.calendarIcon} sx={{ fontSize: '18px' }} />
              <span>Personalizado</span>
              <KeyboardArrowDownOutlinedIcon className={styles.arrowButton} />
            </button>
          </div>
          <button
            className={styles.restart}
            onClick={() => fetchSummary(activePreset)}
            title="Actualizar métricas"
            aria-label="Actualizar métricas"
          >
            <RestartAltIcon className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <DashboardMetricsGrid metrics={metrics} styles={styles} />

      <div className={styles.datos}>
        <Container maxWidth={false} sx={{ maxWidth: '45vw' }} className={`${styles.contenedor} ${styles.neighborContainer}`}>
          <LineMarkShape totalEvents={metrics.total_analyzed_events} />
        </Container>
        <Container maxWidth={false} sx={{ maxWidth: '45vw' }} className={`${styles.contenedor} ${styles.chartContainer}`}>
          <TitanicPie totalEvents={metrics.total_analyzed_events} />
        </Container>
      </div>

      <div className={styles.datos}>
        <Container maxWidth={false} sx={{ maxWidth: '70vw' }} className={styles.contenedor} id={styles.dash2}>
          <ColorConfig />
        </Container>
        <HoneypotAdvisor totalEvents={metrics.total_analyzed_events} styles={styles} />
      </div>
      </main>

      <Footer />
    </>
  );
}
