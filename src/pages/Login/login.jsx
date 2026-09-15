import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import styles from"./login.module.css"
import animation from "../../assets/animations/GotaMiel.svg"

export default function Login() {
    return(
        <Container className={styles.ContenedorLogin} maxWidth="sm">
            <Container className={styles.contenidoPanal}>
                <div className={styles.gotaMiel}>
                    <object data={animation} type="image/svg+xml" aria-label="Gota de Miel" />
                </div>
                <form>
                    <label className={styles.labels}> usuario</label> <br/><br/>
                    <input className={styles.ejemplo} placeholder="Digite su correo electronico"></input> <br/>
                    <input placeholder="Digite su contraseña"></input>
                    <Button variant="contained"></Button>
                    <h1 className={styles.hola}>hola</h1>
                </form>
            </Container>
        </Container>
    )
}

