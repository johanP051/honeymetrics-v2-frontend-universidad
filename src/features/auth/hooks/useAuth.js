import { useState } from 'react';
import { apiClient } from '../../../api/client';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.status === 429) {
          setError('Demasiados intentos. Espere un momento');
        } else if (err.response.status === 401) {
          setError('Correo o contraseña incorrectos');
        } else {
          setError('Ocurrió un error inesperado');
        }
      } else {
        setError('Error de conexión con el servidor');
      }
      throw err;
    }
  };

  return { login, isLoading, error };
};
