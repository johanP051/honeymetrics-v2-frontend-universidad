import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import styles from "./login.module.css";
import animation from "../../assets/animations/GotaMiel.svg";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Por favor ingrese correo y contraseña");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      // Redirigir al panel principal tras login exitoso
      navigate("/Dashboard");
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        "Error de conexión con el servidor. Intente más tarde.";
      setErrorMsg(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

          <form onSubmit={handleSubmit}>
            <label className={styles.labels}>Email</label> <br />
            <input
              className={styles.inputs}
              placeholder="Digite su correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <br />

            <label className={styles.labels}>Password</label>
            <input
              className={styles.inputs}
              placeholder="Digite su contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />

            {errorMsg && (
              <div className={styles.errorMessage} role="alert">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Autenticando..." : "Ingresar a HoneyMetrics"}
            </button>
          </form>
        </Container>
      </Container>
    </div>
  );
}
