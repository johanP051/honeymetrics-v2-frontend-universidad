import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import styles from"./login.module.css"

export default function Login() {
    return(
        <Container className={styles.ContenedorLogin} maxWidth="sm">
            <Container className={styles.contenidoPanal}>
                <div className={styles.gotaMiel}></div>
                <form>
                    <input className={styles.ejemplo} placeholder="Digite su correo electronico"></input> <br/>
                    <input placeholder="Digite su contraseña"></input>
                    <Button variant="contained"></Button>
                    <h1 className={styles.hola}>hola</h1>
                </form>
            </Container>
        </Container>
    )
}

