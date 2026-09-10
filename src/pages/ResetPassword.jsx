import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import PasswordEyeIcon from '../components/common/PasswordEyeIcon';
import { usePasswordRecovery } from '../features/auth/hooks/usePasswordRecovery';
import Footer from '../components/layout/Footer';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { resetPassword, isLoading, error: hookError } = usePasswordRecovery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!token) {
      setValidationError('El enlace de recuperación es inválido o no incluye el token.');
      return;
    }

    if (password.length < 8) {
      setValidationError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const isAlphanumeric = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
    if (!isAlphanumeric) {
      setValidationError('La contraseña debe contener letras y números (alfanumérico).');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Contraseña actualizada exitosamente. Inicia sesión con tus nuevas credenciales.' },
        });
      }, 2000);
    } catch {
      // Error manejado por usePasswordRecovery y validationError
    }
  };

  const displayError = validationError || hookError;

  return (
    <div className="min-h-screen bg-hm-bg flex flex-col justify-between">
      {/* Header con Logo */}
      <header className="p-6 flex items-center gap-3">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
        />
        <span className="text-2xl font-display font-bold text-hm-gold tracking-wide">
          HoneyMetrics
        </span>
      </header>

      {/* Contenedor Central */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="glass-card p-8 border border-hm-border/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-display font-bold text-hm-text">
                  ¡Contraseña Restablecida!
                </h2>
                <p className="text-sm text-hm-muted">
                  Tu contraseña ha sido actualizada con éxito. Serás redirigido al inicio de sesión en unos segundos...
                </p>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 w-full border-2 border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg font-bold py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    Ir al Login Ahora
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-hm-gold/10 border border-hm-gold/30 rounded-lg flex items-center justify-center text-hm-gold">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-hm-text">
                      Nueva Contraseña
                    </h2>
                    <p className="text-xs text-hm-muted">
                      Define tus nuevas credenciales de acceso institucional.
                    </p>
                  </div>
                </div>

                {!token && (
                  <div className="mb-4 text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-3 text-sm">
                    Advertencia: No se detectó un token en la URL. Asegúrate de abrir el enlace completo que recibiste en tu correo.
                  </div>
                )}

                {displayError && (
                  <div className="mb-4 text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-3 text-sm">
                    {displayError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-hm-text mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        required
                        disabled={isLoading}
                        className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 pr-10 text-hm-text focus:outline-none focus:border-hm-gold focus:ring-1 focus:ring-hm-gold transition-colors"
                        placeholder="Mínimo 8 caracteres alfanuméricos"
                      />
                      <PasswordEyeIcon
                        isVisible={showPassword}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-hm-text mb-2">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        required
                        disabled={isLoading}
                        className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 pr-10 text-hm-text focus:outline-none focus:border-hm-gold focus:ring-1 focus:ring-hm-gold transition-colors"
                        placeholder="Repite la nueva contraseña"
                      />
                      <PasswordEyeIcon
                        isVisible={showConfirmPassword}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-transparent border-2 border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg hover:shadow-[0_0_15px_rgba(212,175,55,0.35)] font-bold py-3 px-4 rounded-lg transition-all duration-300 flex justify-center items-center h-12"
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      'Restablecer Contraseña'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-hm-muted hover:text-hm-gold transition-colors"
                  >
                    <ArrowLeft size={16} /> Volver al Login
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
