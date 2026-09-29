import { Container } from '@mui/material';
import styles from "./dashboard.module.css"
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TitanicPie from '../../components/common/chartPie';

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
                    <button> Personalizado </button>

                </div>
            </div>
        </div>

        <div className={styles.datos}>
            <Container maxWidth={false} sx={{maxWidth: "20vw"}}className={styles.contenedor} id ={styles.dat}/>
            <Container maxWidth={false} sx={{maxWidth: "20vw"}}className={styles.contenedor} id ={styles.dat}/>
            <Container maxWidth={false} sx={{maxWidth: "20vw"}}className={styles.contenedor} id ={styles.dat}/>
            <Container maxWidth={false} sx={{maxWidth: "20vw"}}className={styles.contenedor} id ={styles.dat}/>
        </div>
       <div className={styles.datos}>      
            <Container maxWidth={false} sx={{maxWidth: "45vw"}} className={`${styles.contenedor} ${styles.neighborContainer}`}/>
            <Container maxWidth={false} sx={{maxWidth: "45vw"}} className={`${styles.contenedor} ${styles.chartContainer}`}>
                <TitanicPie/>
            </Container>
       </div>
        <div className={styles.datos}>      
            <Container maxWidth={false} sx={{maxWidth: "70vw"}}className={styles.contenedor} id={styles.dash2}/>
            <Container maxWidth={false} sx={{maxWidth: "25vw"}}className={styles.contenedor} id={styles.dash2}/>
       </div>
       </>
    );
}