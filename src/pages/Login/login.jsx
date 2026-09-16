
import Container from "@mui/material/Container";
import styles from"./login.module.css"
import animation from "../../assets/animations/GotaMiel.svg"

export default function Login() {
    return(
        <div className={styles.body}>
            <Container className={styles.ContenedorLogin} maxWidth="sm">
                <Container className={styles.contenidoPanal}>
                    <div className={styles.gotaMiel}>
                        <object data={animation} type="image/svg+xml" aria-label="Gota de Miel" />
                    </div>
                    <div className={styles.gotaMielDerecha}>
                        <object data={animation} type="image/svg+xml" aria-label="Gota de Miel" />
                    </div>
                    <div className={styles.gotaMielIzquierda}>
                        <object data={animation} type="image/svg+xml" aria-label="Gota de Miel" />
                    </div>
                    <form>
                        <label className={styles.labels}> Email</label> <br/>
                        <input className={styles.inputs} placeholder="Digite su correo electronico" type='email'></input> <br/>
                        <label className={styles.labels}> Password</label>
                        <input className={styles.inputs} placeholder="Digite su contraseña" type='password'></input>
                    </form>
                </Container>
            </Container>
        </div>
    )
}

