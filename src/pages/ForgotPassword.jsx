import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { usePasswordRecovery } from '../features/auth/hooks/usePasswordRecovery';
import Footer from '../components/layout/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const { requestResetLink, isLoading, isSubmitted, error: recoveryError } = usePasswordRecovery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith('@ucundinamarca.edu.co')) {
      setValidationError('Solo se permiten correos institucionales (@ucundinamarca.edu.co).');
      return;
    }

    try {
      await requestResetLink(normalizedEmail);
    } catch {
      // El error (ej. Rate Limit 429) se expone a través del estado de usePasswordRecovery
    }
  };

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

      {/* Contenedor Central Glassmórfico */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="glass-card p-8 border border-hm-border/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            {isSubmitted ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-hm-gold/10 border border-hm-gold/30 rounded-full flex items-center justify-center mx-auto text-hm-gold">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-display font-bold text-hm-text">
                  Enlace Enviado
                </h2>
                <p className="text-sm text-hm-muted leading-relaxed bg-hm-elevated/40 border border-hm-border/30 rounded-lg p-4 text-left">
                  Si el correo ingresado pertenece a una cuenta institucional activa, hemos enviado un enlace de recuperación con vigencia de 1 hora. Revisa tu bandeja de entrada.
                </p>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 w-full border-2 border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg font-bold py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    <ArrowLeft size={18} /> Volver al Login
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold text-hm-text mb-2">
                    Recuperar Contraseña
                  </h2>
                  <p className="text-sm text-hm-muted">
                    Ingresa tu correo institucional para recibir un enlace seguro de restablecimiento.
                  </p>
                </div>

                {(validationError || recoveryError) && (
                  <div className="mb-4 text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-3 text-sm flex items-center gap-2">
                    <span>{validationError || recoveryError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-hm-text mb-2">
                      Correo Institucional
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        required
                        disabled={isLoading}
                        className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 pr-10 text-hm-text focus:outline-none focus:border-hm-gold focus:ring-1 focus:ring-hm-gold transition-colors"
                        placeholder="usuario@ucundinamarca.edu.co"
                      />
                      <Mail
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-hm-muted"
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
                      'Enviar Enlace de Recuperación'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-hm-muted hover:text-hm-gold transition-colors"
                  >
                    <ArrowLeft size={16} /> Volver al inicio de sesión
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
