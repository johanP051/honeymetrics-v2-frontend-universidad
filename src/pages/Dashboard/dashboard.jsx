import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@mui/material';
import styles from "./dashboard.module.css";
import style from "../Blacklist/blacklist.module.css";
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TitanicPie from '../../components/common/chartPie';
import LineMarkShape from '../../components/common/chartLine';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ColorConfig from '../../components/common/heatMap';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import Navbar from '../../components/layout/Navbar';
import api from '../../api/client';
import CircularProgress from '@mui/material/CircularProgress';

const advisorTemplates = [
    { name: 'root', type: 'System', percentage: 59.6, icon: TerminalOutlinedIcon, color: 'yellow' },
    { name: 'admin', type: 'System', percentage: 17.2, icon: TerminalOutlinedIcon, color: 'yellow' },
    { name: 'postgres', type: 'Database', percentage: 8.6, icon: StorageOutlinedIcon, color: 'teal' },
    { name: 'odoo', type: 'ERP', percentage: 6.0, icon: GppMaybeOutlinedIcon, color: 'red' },
    { name: 'jenkins', type: 'DevOps', percentage: 3.2, icon: StorageOutlinedIcon, color: 'yellow' },
    { name: 'Ubuntu', type: 'System', percentage: 2.3, icon: TerminalOutlinedIcon, color: 'yellow' },
];

export default function Dashboard() {
    const [activePreset, setActivePreset] = useState('7d');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
                params: {
                    range_preset: preset,
                    range: preset,
                }
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
            // Fallback coherente con el preset seleccionado
            const fallbacks = {
                '24h': { total_analyzed_events: 1920, unique_attacker_ips: 84, persistent_threats_count: 3, active_critical_cves_count: 142 },
                '7d': { total_analyzed_events: 28400, unique_attacker_ips: 320, persistent_threats_count: 7, active_critical_cves_count: 680 },
                '30d': { total_analyzed_events: 84200, unique_attacker_ips: 680, persistent_threats_count: 9, active_critical_cves_count: 1240 },
                '90d': { total_analyzed_events: 142000, unique_attacker_ips: 990, persistent_threats_count: 9, active_critical_cves_count: 1590 },
            };
            if (fallbacks[preset]) {
                setMetrics((prev) => ({ ...prev, ...fallbacks[preset] }));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary(activePreset);
    }, [activePreset, fetchSummary]);

    const handlePresetChange = (preset) => {
        setActivePreset(preset);
    };

    const handleRefresh = () => {
        fetchSummary(activePreset);
    };

    return (
        <>
        {loading ? (
            <div className={style.loadingOverlay} role="status" aria-live="polite" aria-label="Cargando métricas del dashboard">
                <CircularProgress aria-label="Cargando" />
            </div>
        ) : null}

        <Navbar />

        <div className={styles.headerContent}>
            <div className={styles.textHeader}>
                <div className={styles.textContent}>
                    <h2><DashboardIcon className={styles.icon} sx={{ fontSize: '30px' }}/>Dashboard</h2>
                    <p>Monitoreo de telemetría e indicadores del Honeypot (CTI).</p>
                </div>
            </div>
            <div className={styles.buttons}>
                <div className={styles.contenedorBotones}>
                    <button
                        type="button"
                        className={activePreset === '24h' ? styles.activeButton : ''}
                        onClick={() => handlePresetChange('24h')}
                    >
                        Últimas 24h
                    </button>
                    <button
                        type="button"
                        className={activePreset === '7d' ? styles.activeButton : ''}
                        onClick={() => handlePresetChange('7d')}
                    >
                        Últimas 7 días
                    </button>
                    <button
                        type="button"
                        className={activePreset === '30d' ? styles.activeButton : ''}
                        onClick={() => handlePresetChange('30d')}
                    >
                        Últimas 30 días
                    </button>
                    <button
                        type="button"
                        className={activePreset === '90d' ? styles.activeButton : ''}
                        onClick={() => handlePresetChange('90d')}
                    >
                        Últimos trimestres
                    </button>
                    <p>|</p>
                    <button type="button" className={styles.calendarButton}>
                        <CalendarMonthOutlinedIcon className={styles.calendarIcon} sx={{ fontSize: '18px' }}/>
                        <span>Personalizado</span>
                        <KeyboardArrowDownOutlinedIcon className={styles.arrowButton}/>
                    </button>
                </div>
                <button
                    className={styles.restart}
                    onClick={handleRefresh}
                    title="Actualizar métricas"
                    aria-label="Actualizar métricas"
                >
                    <RestartAltIcon className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
        </div>

        <div className={styles.datos}>
            <Container maxWidth={false} className={styles.contenedor} id={styles.dat}>
                <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>Eventos analizados</h3>
                    <AssessmentOutlinedIcon className={`${styles.metricIcon} ${styles.metricBlue}`}/>
                </div>
                <h2 className={styles.metricBlue}>
                    {Number(metrics.total_analyzed_events).toLocaleString('es-CO')}
                </h2>
            </Container>

            <Container maxWidth={false} className={styles.contenedor} id={styles.dat}>
                <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>IPs Atacantes</h3>
                    <ReportGmailerrorredIcon className={`${styles.metricIcon} ${styles.metricRed}`}/>
                </div>
                <h2 className={styles.metricRed}>
                    {Number(metrics.unique_attacker_ips).toLocaleString('es-CO')}
                </h2>
            </Container>
            
            <Container maxWidth={false} className={styles.contenedor} id={styles.dat}>
                <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>Amenazas Persistentes</h3>
                    <TrendingUpIcon className={`${styles.metricIcon} ${styles.metricYellow}`}/>
                </div>
                <h2 className={styles.metricYellow}>
                    {Number(metrics.persistent_threats_count).toLocaleString('es-CO')}
                </h2>
            </Container>

            <Container maxWidth={false} className={styles.contenedor} id={styles.dat}>
                <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>CVEs Activos</h3>
                    <VerifiedUserOutlinedIcon className={`${styles.metricIcon} ${styles.metricGreen}`}/>
                </div>
                <h2 className={styles.metricGreen}>
                    {Number(metrics.active_critical_cves_count).toLocaleString('es-CO')}
                </h2>
            </Container>
        </div>

        <div className={styles.datos}>      
            <Container maxWidth={false} sx={{maxWidth: "45vw"}} className={`${styles.contenedor} ${styles.neighborContainer}`}>
                <LineMarkShape totalEvents={metrics.total_analyzed_events} />
            </Container>
            <Container maxWidth={false} sx={{maxWidth: "45vw"}} className={`${styles.contenedor} ${styles.chartContainer}`}>
                <TitanicPie totalEvents={metrics.total_analyzed_events} />
            </Container>
        </div>

        <div className={styles.datos}>      
            <Container maxWidth={false} sx={{maxWidth: "70vw"}} className={styles.contenedor} id={styles.dash2}>
                <ColorConfig/>
            </Container>

            <Container maxWidth={false} sx={{maxWidth: "25vw"}} className={`${styles.contenedor} ${styles.advisorContainer}`}>
                <div className={styles.advisorHeader}>
                    <div>
                        <h6>Honeypot Advisor</h6>
                        <p>Top diccionarios SSH probados</p>
                    </div>
                    <span className={styles.advisorBadge}>CTI RECON</span>
                </div>
                <div className={styles.advisorList}>
                    {advisorTemplates.map(({ name, type, percentage, icon: Icon, color }) => {
                        const calculatedAttempts = Math.max(1, Math.round((metrics.total_analyzed_events || 0) * (percentage / 100)));
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
                    );})}
                </div>
            </Container>
        </div>
        </>
    );
}