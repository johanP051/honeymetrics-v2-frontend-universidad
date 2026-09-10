import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AiOrbAnimation from '../components/common/AiOrbAnimation';
import Footer from '../components/layout/Footer';
import PasswordEyeIcon from '../components/common/PasswordEyeIcon';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 429) {
          setError('Demasiados intentos. Espere un momento');
        } else if (err.response.status === 401) {
          setError('Correo o contraseña incorrectos');
        } else {
          setError('Ocurrió un error inesperado');
        }
      } else {
        setError(err.message || 'Error de autenticación');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hm-bg flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
        {/* Columna Izquierda - Animación (Oculta en móvil) */}
        <div className="hidden md:flex flex-col items-center justify-center relative p-8 border-r border-hm-border bg-gradient-to-br from-hm-bg to-hm-elevated">
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
            <h1 className="text-2xl font-display font-bold text-hm-gold m-0 tracking-wide">HoneyMetrics</h1>
          </div>
          
          <AiOrbAnimation />
          
          <div className="mt-12 text-center max-w-md">
            <h2 className="text-3xl font-display font-bold text-hm-text mb-4">Bienvenido al Sistema CTI</h2>
            <p className="text-hm-muted text-lg">
              Plataforma avanzada de monitoreo y correlación de amenazas basada en Machine Learning.
            </p>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="flex flex-col items-center justify-center p-8 relative">
          <div className="w-full max-w-md animate-fade-up">
            <div className="md:hidden flex items-center gap-3 mb-8 justify-center">
              <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
              <h1 className="text-2xl font-display font-bold text-hm-gold m-0">HoneyMetrics</h1>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-display font-bold text-hm-text mb-2">Iniciar Sesión</h2>
              <p className="text-hm-muted mb-8">Ingresa tus credenciales para continuar.</p>

              {location.state?.message && (
                <div className="mb-4 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded p-3 text-sm">
                  {location.state.message}
                </div>
              )}

              {error && (
                <div className="mb-4 text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-3 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-hm-text mb-2">Correo Electrónico o Usuario</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 text-hm-text focus:outline-none focus:border-hm-gold focus:ring-1 focus:ring-hm-gold transition-colors"
                    placeholder="admin@honeymetrics.com o root"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-hm-text">Contraseña</label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-hm-muted hover:text-hm-gold transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 pr-10 text-hm-text focus:outline-none focus:border-hm-gold focus:ring-1 focus:ring-hm-gold transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <PasswordEyeIcon 
                      isVisible={showPassword} 
                      onClick={() => setShowPassword(!showPassword)} 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-transparent border-2 border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg hover:shadow-[0_0_15px_rgba(212,175,55,0.35)] font-bold py-3 px-4 rounded-lg transition-all duration-300 flex justify-center items-center h-12"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Ingresar'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
