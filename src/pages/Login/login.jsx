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
                    <label className={styles.labels}> Email</label> <br/>
                    <input className={styles.inputs} placeholder="Digite su correo electronico" type='email'></input> <br/>
                    <label className={styles.labels}> Password</label>
                    <input className={styles.inputs} placeholder="Digite su contraseña" type='password'></input>
                    <Button variant="contained">Sign in</Button>
                </form>
            </Container>
        </Container>
    )
}

