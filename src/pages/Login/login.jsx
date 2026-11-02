import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import styles from "./login.module.css";
import animation from "../../assets/animations/GotaMiel.svg";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/authService";
import LoginMfaStep from "./LoginMfaStep";
import PasswordEyeIcon from "../../components/common/PasswordEyeIcon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, verifyMfaLogin } = useAuth();
  const navigate = useNavigate();
  const isSessionExpired = new URLSearchParams(window.location.search).get("expired") === "1";

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Por favor ingrese correo y contraseña");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (res?.mfa_required) {
        setMfaToken(res.mfa_token);
        setMfaRequired(true);
        setMfaCode("");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Error al iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMfaVerify = async (code) => {
    setErrorMsg("");
    try {
      setIsSubmitting(true);
      await verifyMfaLogin(mfaToken, code);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Código de verificación o de respaldo incorrecto.";
      setErrorMsg(msg);
      // Renovación silenciosa de mfa_token en segundo plano
      try {
        const refreshData = await authService.login(email, password);
        if (refreshData?.mfa_token) {
          setMfaToken(refreshData.mfa_token);
        }
      } catch {
        // Si fallan las credenciales originales, se mantiene el estado
      }
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

          {mfaRequired ? (
            <LoginMfaStep
              mfaCode={mfaCode}
              setMfaCode={setMfaCode}
              onVerify={handleMfaVerify}
              onBack={() => {
                setMfaRequired(false);
                setErrorMsg("");
              }}
              isSubmitting={isSubmitting}
              errorMsg={errorMsg}
              styles={styles}
            />
          ) : (
            <form onSubmit={handleCredentialsSubmit}>
              <div className="flex flex-col items-center justify-center mb-4">
                <img
                  src="/images/logo.png"
                  alt="HoneyMetrics Logo"
                  className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] mb-1"
                />
                <span className="text-base font-display font-bold text-hm-gold tracking-wider">
                  HoneyMetrics
                </span>
              </div>

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
              <div className="relative w-full">
                <input
                  id="login-password"
                  className={styles.inputs}
                  placeholder="Digite su contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <PasswordEyeIcon
                  isVisible={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  controlsId="login-password"
                />
              </div>

              <div className="text-right mt-1.5 mb-3">
                <Link
                  to="/forgot-password"
                  className="text-xs text-hm-gold hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {isSessionExpired && !errorMsg && (
                <div
                  style={{
                    color: "#d4af37",
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    borderRadius: "6px",
                    padding: "10px",
                    marginBottom: "14px",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                  role="status"
                >
                  Su sesión ha caducado por límite de tiempo. Inicie sesión nuevamente.
                </div>
              )}

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
          )}
        </Container>
      </Container>
    </div>
  );
}
