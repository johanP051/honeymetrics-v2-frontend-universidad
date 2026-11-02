import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import PasswordEyeIcon from '../components/common/PasswordEyeIcon';
import { usePasswordRecovery } from '../features/auth/hooks/usePasswordRecovery';
import { calculatePasswordStrength } from '../hooks/useProfileSecurity';
import Footer from '../components/layout/Footer';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get('token') || '');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const redirectTimerRef = useRef(null);

  const { resetPassword, isLoading, error: hookError } = usePasswordRecovery();
  const strength = calculatePasswordStrength(password);

  useEffect(() => {
    if (searchParams.get('token')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!token) {
      setValidationError('El enlace de recuperación es inválido o no incluye el token.');
      return;
    }
    if (password.length < 12) {
      setValidationError('La contraseña debe tener al menos 12 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      redirectTimerRef.current = setTimeout(() => {
        navigate('/login', {
          state: { message: 'Contraseña actualizada exitosamente. Inicia sesión con tus nuevas credenciales.' },
        });
      }, 2000);
    } catch {
      // Error manejado por el hook
    }
  };

  const displayError = validationError || hookError;

  return (
    <div className="min-h-screen bg-hm-bg flex flex-col justify-between">
      <header className="p-6 flex items-center gap-3">
        <img src="/images/logo.png" alt="HoneyMetrics Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
        <span className="text-2xl font-display font-bold text-hm-gold tracking-wide">HoneyMetrics</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="glass-card p-8 border border-hm-border/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle size={32} aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-display font-bold text-hm-text">¡Contraseña Restablecida!</h1>
                <p className="text-sm text-hm-muted">Tu contraseña ha sido actualizada. Redirigiendo al inicio de sesión...</p>
                <div className="pt-2">
                  <Link to="/login" className="inline-flex items-center justify-center gap-2 w-full border-2 border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg font-bold py-3 px-4 rounded-lg transition-all duration-300">
                    Ir al Login Ahora
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-hm-gold/10 border border-hm-gold/30 rounded-lg flex items-center justify-center text-hm-gold">
                    <KeyRound size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-display font-bold text-hm-text">Nueva Contraseña</h1>
                    <p className="text-xs text-hm-muted">Define tus nuevas credenciales de acceso.</p>
                  </div>
                </div>

                {!token && (
                  <div role="alert" className="mb-4 text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-3 text-sm">
                    Advertencia: No se detectó un token en la URL. Abre el enlace completo recibido por correo.
                  </div>
                )}
                {displayError && (
                  <div role="alert" className="mb-4 text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-3 text-sm">
                    {displayError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="reset-new-password" className="block text-sm font-medium text-hm-text mb-2">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        id="reset-new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); if (validationError) setValidationError(''); }}
                        required minLength={12} disabled={isLoading}
                        className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 pr-10 text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
                        placeholder="Mínimo 12 caracteres"
                      />
                      <PasswordEyeIcon isVisible={showPassword} onClick={() => setShowPassword(!showPassword)} controlsId="reset-new-password" />
                    </div>
                    {password && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center text-[11px] text-hm-muted mb-1">
                          <span>Seguridad:</span><span className="font-semibold text-hm-text">{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-hm-elevated rounded-full overflow-hidden">
                          <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.score}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reset-confirm-password" className="block text-sm font-medium text-hm-text mb-2">Confirmar Contraseña</label>
                    <div className="relative">
                      <input
                        id="reset-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); if (validationError) setValidationError(''); }}
                        required minLength={12} disabled={isLoading}
                        className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 pr-10 text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
                        placeholder="Repite la nueva contraseña"
                      />
                      <PasswordEyeIcon isVisible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} controlsId="reset-confirm-password" />
                    </div>
                  </div>

                  <button
                    type="submit" disabled={isLoading}
                    className="w-full bg-transparent border-2 border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg font-bold py-3 px-4 rounded-lg transition-all duration-300 flex justify-center items-center h-12 disabled:opacity-50"
                  >
                    {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm text-hm-muted hover:text-hm-gold transition-colors">
                    <ArrowLeft size={16} aria-hidden="true" /> Volver al Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
