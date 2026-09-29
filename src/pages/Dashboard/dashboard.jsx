import { Container } from '@mui/material';
import styles from "./dashboard.module.css"
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
import { GoDatabase } from "react-icons/go";
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const advisorItems = [
    { name: 'root', type: 'System', attempts: '98.450', percentage: 59.6, icon: TerminalOutlinedIcon, color: 'yellow' },
    { name: 'admin', type: 'System', attempts: '28.410', percentage: 17.2, icon: TerminalOutlinedIcon, color: 'yellow' },
    { name: 'postgres', type: 'Database', attempts: '14.220', percentage: 8.6, icon: GoDatabase, color: 'teal' },
    { name: 'odoo', type: 'ERP', attempts: '9840', percentage: 6, icon: GppMaybeOutlinedIcon, color: 'red' },
    { name: 'jenkins', type: 'DevOps', attempts: '5310', percentage: 3.2, icon: StorageOutlinedIcon, color: 'yellow' },
    { name: 'Ubuntu', type: 'System', attempts: '3820', percentage: 2.3, icon: TerminalOutlinedIcon, color: 'yellow' },
];

export default function Dashboard(){
    return (
        <>
        <div className={styles.headerContent}>
            <div className={styles.textHeader}>
                <DashboardIcon className={styles.icon} sx={{ fontSize: '30px' }}/>
                <div className={styles.textContent}>
                    <h2>Dashboard</h2>
                    <p>Monitoreo de telemetría e indicadores del Honeypot (CTI).</p>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.restart}><RestartAltIcon/></button>
                <div className={styles.contenedorBotones}>
                    <button> Últimas 24h </button>
                    <button> Últimas 7 días </button>
                    <button> Últimas 30 días </button>
                    <button> Últimos trimestres </button>
                    <p>|</p>
                    <button className={styles.calendarButton}>
                        <CalendarMonthOutlinedIcon className={styles.calendarIcon} sx={{ fontSize: '18px' }}/>
                        <span>Personalizado</span>
                        <KeyboardArrowDownOutlinedIcon className={styles.arrowButton}/>
                    </button>

                </div>
            </div>
        </div>

        <div className={styles.datos}>
            <Container maxWidth={false} sx={{maxWidth: "23vw"}}className={styles.contenedor} id ={styles.dat}>
                <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>Eventos analizados</h3>
                    <AssessmentOutlinedIcon className={`${styles.metricIcon} ${styles.metricBlue}`}/>
                </div>
                <h2 className={styles.metricBlue}>0</h2>
            </Container>

            <Container maxWidth={false} sx={{maxWidth: "23vw"}}className={styles.contenedor} id ={styles.dat}>
                <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>IPs Atacantes</h3>
                    <ReportGmailerrorredIcon className={`${styles.metricIcon} ${styles.metricRed}`}/>
                </div>
                <h2 className={styles.metricRed}>0</h2>
            </Container>
            
            <Container maxWidth={false} sx={{maxWidth: "23vw"}}className={styles.contenedor} id ={styles.dat}>
                <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>Amenazas Persistentes</h3>
                    <TrendingUpIcon className={`${styles.metricIcon} ${styles.metricYellow}`}/>
                </div>
                <h2 className={styles.metricYellow}>0</h2>
            </Container>
            <Container maxWidth={false} sx={{maxWidth: "23vw"}}className={styles.contenedor} id ={styles.dat}>
                <div className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>CVEs Activos</h3>
                    <VerifiedUserOutlinedIcon className={`${styles.metricIcon} ${styles.metricGreen}`}/>
                </div>
                <h2 className={styles.metricGreen}>0</h2>
            </Container>
        </div>
       <div className={styles.datos}>      
            <Container maxWidth={false} sx={{maxWidth: "45vw"}} className={`${styles.contenedor} ${styles.neighborContainer}`}>
                <LineMarkShape/>
            </Container>
            <Container maxWidth={false} sx={{maxWidth: "45vw"}} className={`${styles.contenedor} ${styles.chartContainer}`}>
                <TitanicPie/>
            </Container>
       </div>
        <div className={styles.datos}>      
            <Container maxWidth={false} sx={{maxWidth: "70vw"}}className={styles.contenedor} id={styles.dash2}>
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
                    {advisorItems.map(({ name, type, attempts, percentage, icon: Icon, color }) => (
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
                                    {attempts} <small>intentos</small>
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
                    ))}
                </div>
            </Container>
       </div>
       </>
    );
}