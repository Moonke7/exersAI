import { useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

export interface InventarioItem {
  id: number;
  equipo_id: number;
  cantidad: number;
  espacio_id: number;
  usuario_id: string;
  created_at?: string;
  equipos?: {
    id: number;
    nombre: string;
    imagen_url: string | null;
  };
}

export function useEquipamiento() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  // Obtener inventario de un espacio
  const getInventario = async (
    espacioId: number,
  ): Promise<InventarioItem[]> => {
    if (!user?.id) {
      console.error('No hay usuario autenticado');
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiFetch(
        `/api/equipamiento/${user.id}/${espacioId}`,
        {
          method: 'GET',
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener inventario');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error fetching inventario:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Crear item en inventario
  const createInventarioItem = async (
    equipoId: number,
    cantidad: number,
    espacioId: number,
  ): Promise<InventarioItem | null> => {
    if (!user?.id) {
      console.error('No hay usuario autenticado');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiFetch('/api/equipamiento', {
        method: 'POST',
        body: JSON.stringify({
          equipo_id: equipoId,
          cantidad,
          espacio_id: espacioId,
          user_id: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear item');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error creating inventario item:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar item del inventario
  const deleteInventarioItem = async (itemId: number): Promise<boolean> => {
    if (!user?.id) {
      console.error('No hay usuario autenticado');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiFetch(`/api/equipamiento/${itemId}`, {
        method: 'DELETE',
        body: JSON.stringify({
          user_id: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar item');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error deleting inventario item:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getInventario,
    createInventarioItem,
    deleteInventarioItem,
    isLoading,
    error,
  };
}
