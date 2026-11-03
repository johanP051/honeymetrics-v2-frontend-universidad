import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./login.module.css";
import logoCircled from "../../assets/HoneyMetrics_logo_circled.png";
import gotaMielAnim from "../../assets/animations/GotaMiel.svg";
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
        void navigate("/dashboard");
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
      void navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Código de verificación o de respaldo incorrecto.";
      setErrorMsg(msg);
      try {
        const refreshData = await authService.login(email, password);
        if (refreshData?.mfa_token) setMfaToken(refreshData.mfa_token);
      } catch {
        // Se preserva token actual si falla
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.hexWrapper}>
        <div className={styles.gotaTopLeft} aria-hidden="true">
          <img src={gotaMielAnim} alt="" className={styles.gotaImg} />
        </div>
        <div className={styles.gotaBottomLeft} aria-hidden="true">
          <img src={gotaMielAnim} alt="" className={styles.gotaImg} />
        </div>
        <div className={styles.gotaRight} aria-hidden="true">
          <img src={gotaMielAnim} alt="" className={styles.gotaImg} />
        </div>

        <div className={styles.hexOuter}>
          <div className={styles.hexInner}>
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
              <form onSubmit={handleCredentialsSubmit} className={styles.loginForm}>
                <div className={styles.logoSection}>
                  <img
                    src={logoCircled}
                    alt="HoneyMetrics Logo"
                    className={styles.logoImage}
                  />
                  <span className={styles.logoTitle}>
                    HoneyMetrics
                  </span>
                </div>

                <label htmlFor="login-email" className={styles.labels}>Correo Electrónico</label>
                <input
                  id="login-email"
                  className={styles.inputs}
                  placeholder="Digite su correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                <label htmlFor="login-password" className={styles.labels}>Contraseña</label>
                <div className={styles.passwordWrapper}>
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
                    className={styles.eyeButton}
                  />
                </div>


                <div className={styles.forgotPasswordWrapper}>
                  <Link
                    to="/forgot-password"
                    className={styles.forgotPasswordLink}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {isSessionExpired && !errorMsg && (
                  <div role="status" className={styles.sessionExpiredAlert}>
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
                  {isSubmitting ? "Autenticando..." : "Iniciar Sesión"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
