import { useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

export interface Espacio {
  id: number;
  nombre: string;
  user_id: string;
  created_at?: string;
}

export function useEspacios() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  // Obtener espacios del usuario
  const getEspacios = async (): Promise<Espacio[]> => {
    if (!user?.id) {
      console.error('No hay usuario autenticado');
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiFetch(`/api/espacios/${user.id}`, {
        method: 'GET',
        authenticated: true,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener espacios');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error fetching espacios:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nuevo espacio
  const createEspacio = async (nombre: string): Promise<Espacio | null> => {
    if (!user?.id) {
      console.error('No hay usuario autenticado');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiFetch('/api/espacios/crear-espacio', {
        method: 'POST',
        authenticated: true,
        body: JSON.stringify({
          nombre,
          user_id: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear espacio');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error creating espacio:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getEspacios,
    createEspacio,
    isLoading,
    error,
  };
}
