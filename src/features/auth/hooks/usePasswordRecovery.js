import { useState } from 'react';
import { apiClient, isMockModeEnabled } from '../../../api/client';

export const usePasswordRecovery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Solicita el enlace de recuperación al backend real de FastAPI.
   * Regla Anti-Enumeración (CWE-200): Siempre devuelve 200 OK con mensaje genérico.
   */
  const requestResetLink = async (email) => {
    setIsLoading(true);
    setError(null);

    if (isMockModeEnabled()) {
      setIsLoading(false);
      setIsSubmitted(true);
      return { message: 'Si el correo está registrado, se ha enviado un enlace de recuperación.' };
    }

    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      setIsLoading(false);
      setIsSubmitted(true);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      if (err.response?.status === 429) {
        setError('Demasiados intentos. Por favor espere un momento.');
      } else if (err.response?.status === 422) {
        const detail = err.response?.data?.detail;
        const message = Array.isArray(detail) ? detail[0]?.msg : detail;
        setError(message || 'El dominio del correo no está permitido para este entorno.');
      } else {
        setError('Error de conexión con el servidor de autenticación.');
      }
      throw err;
    }
  };

  /**
   * Restablece la contraseña comunicándose con el backend real de FastAPI.
   */
  const resetPassword = async (token, newPassword) => {
    setIsLoading(true);
    setError(null);

    if (isMockModeEnabled()) {
      setIsLoading(false);
      return { message: 'Contraseña restablecida exitosamente (Modo Mock).' };
    }

    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      const detail = err.response?.data?.detail || 'Error al restablecer la contraseña.';
      setError(detail);
      throw new Error(detail);
    }
  };

  return {
    requestResetLink,
    resetPassword,
    isLoading,
    error,
    setError,
    isSubmitted,
    setIsSubmitted,
  };
};

export default usePasswordRecovery;
