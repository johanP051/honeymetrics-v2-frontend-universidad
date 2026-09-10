import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await login(email, password);
      setSuccess(true);
    } catch (err) {
      // Error is caught and exposed via error in useAuth
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="text-2xl font-display font-bold text-hm-text mb-4">Iniciar Sesión</h2>
      
      {error && (
        <div className="mb-4 text-hm-danger bg-hm-danger/10 border border-hm-danger/30 rounded p-3 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 text-hm-gold bg-hm-gold/10 border border-hm-gold/30 rounded p-3 text-sm">
          Autenticación exitosa
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="email" className="block text-sm font-medium text-hm-text mb-1">
            Correo Institucional o Usuario
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 text-hm-text focus:outline-none focus:border-hm-gold"
            placeholder="root o correo@ejemplo.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="block text-sm font-medium text-hm-text mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full bg-hm-bg border border-hm-border rounded-lg px-4 py-3 text-hm-text focus:outline-none focus:border-hm-gold"
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-transparent border-2 border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg font-bold py-3 px-4 rounded-lg transition-all flex justify-center items-center"
        >
          {isLoading ? 'Iniciando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
