import { Container } from '@mui/material';
import styles from "./dashboard.module.css"


export default function Dashboard(){
    return (
        <>
        <div>
            <h2>Dashboard</h2>
            <p>Monitoreo de telemetría e indicadores del Honeypot (CTI).</p>
        </div>

        <div className={styles.datos}>
            <Container maxWidth={false} sx={{maxWidth: "20vw"}}className={styles.contenedor} id ={styles.dat}/>
            <Container maxWidth={false} sx={{maxWidth: "20vw"}}className={styles.contenedor} id ={styles.dat}/>
            <Container maxWidth={false} sx={{maxWidth: "20vw"}}className={styles.contenedor} id ={styles.dat}/>
            <Container maxWidth={false} sx={{maxWidth: "20vw"}}className={styles.contenedor} id ={styles.dat}/>
        </div>
       <div className={styles.datos}>      
            <Container maxWidth={false} sx={{maxWidth: "45vw"}}className={styles.contenedor} id={styles.dash1}/>
            <Container maxWidth={false} sx={{maxWidth: "45vw"}}className={styles.contenedor} id={styles.dash1}/>
       </div>
        <div className={styles.datos}>      
            <Container maxWidth={false} sx={{maxWidth: "70vw"}}className={styles.contenedor} id={styles.dash2}/>
            <Container maxWidth={false} sx={{maxWidth: "25vw"}}className={styles.contenedor} id={styles.dash2}/>
       </div>
       </>
    );
}